package org.template.textclassification

import org.apache.predictionio.controller.PDataSource
import org.apache.predictionio.controller.EmptyEvaluationInfo
import org.apache.predictionio.controller.Params
import org.apache.predictionio.controller.SanityCheck
import org.apache.predictionio.data.store.PEventStore

import org.apache.spark.SparkContext
import org.apache.spark.rdd.RDD

import grizzled.slf4j.Logger

/** Define Data Source parameters.
  * appName is the application name.
  * evalK is the the number of folds that are to be used for cross validation (optional)
  */
case class DataSourceParams(
    appName: String,
    evalK: Option[Int]
  ) extends Params


/** Define your DataSource component. Remember, you must
  * implement a readTraining method, and, optionally, a
  * readEval method.
  */
class DataSource (
  val dsp : DataSourceParams
) extends PDataSource[TrainingData, EmptyEvaluationInfo, Query, ActualResult] {

  @transient lazy val logger = Logger[this.type]

  /** Helper function used to store data given a SparkContext. */
  private def readEventData(sc: SparkContext) : RDD[Observation] = {
    //Get RDD of Events.
    PEventStore.find(
      appName = dsp.appName,
      entityType = Some("application"), // specify data entity type
      eventNames = Some(List("e-mail", "chat")) // specify data event name

      // Convert collected RDD of events to and RDD of Observation
      // objects.
    )(sc).map(e => {
      val label : String = e.properties.get[String]("label")
      Observation(
        // if (label == "spam") 10.0 else if (label == "Q1") 1.0 else if (label == "Q2") 2.0 else if (label == "Q3") 3.0 else 0.0,
        //if (label != "") label.toDouble else 0.0,
        e.properties.get[String]("text"),
        e.properties.get[String]("appId"),
        label.toDouble
      )
    }).cache
  }

  /** Helper function used to store stop words from event server. */
  private def readStopWords(sc : SparkContext) : Set[String] = {
    PEventStore.find(
      appName = dsp.appName,
      entityType = Some("resource"),
      eventNames = Some(List("stopwords"))

      //Convert collected RDD of strings to a string set.
    )(sc)
      .map(e => e.properties.get[String]("word"))
      .collect
      .toSet
  }

  /** Read in data and stop words from event server
    * and store them in a TrainingData instance.
    */
  override
  def readTraining(sc: SparkContext): TrainingData = {
    new TrainingData(readEventData(sc), readStopWords(sc))
  }

  /** Used for evaluation: reads in event data and creates cross-validation folds. */
  override
  def readEval(sc: SparkContext):
  Seq[(TrainingData, EmptyEvaluationInfo, RDD[(Query, ActualResult)])] = {
    // Zip your RDD of events read from the server with indices
    // for the purposes of creating our folds.
    val data = readEventData(sc).zipWithIndex()
    // Create cross validation folds by partitioning indices
    // based on their index value modulo the number of folds.
    (0 until dsp.evalK.get).map { k =>
      // Prepare training data for fold.
      val train = new TrainingData(
        data.filter(_._2 % dsp.evalK.get != k).map(_._1),
        readStopWords
          ((sc)))

      // Prepare test data for fold.
      val test = data.filter(_._2 % dsp.evalK.get == k)
        .map(_._1)
        .map(e => (Query(e.text), ActualResult(e.category)))

      (train, new EmptyEvaluationInfo, test)
    }
  }

}

/** Observation class serving as a wrapper for both our
  * data's class label and document string.
  */
case class Observation(
  label: Double,
  text: String,
  category: String
 // appId: String
)

/** TrainingData class serving as a wrapper for all
  * read in from the Event Server.
  */
class TrainingData(
  val data : RDD[Observation],
  val stopWords : Set[String]
) extends Serializable with SanityCheck {

  /** Sanity check to make sure your data is being fed in correctly. */
  def sanityCheck(): Unit = {
    try {
      val obs : Array[Double] = data.takeSample(false, 5).map(_.label)

      println()
      (0 until 5).foreach(
        k => println("Observation " + (k + 1) +" label: " + obs(k))
      )
      println()
    } catch {
      case (e : ArrayIndexOutOfBoundsException) => {
        println()
        println("Data set is empty, make sure event fields match imported data.")
        println()
      }
    }

  }

}
