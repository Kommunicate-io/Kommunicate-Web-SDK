package org.template.textclassification

import org.apache.predictionio.controller.PPreparator
import org.apache.predictionio.controller.Params

import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.mllib.feature.{IDF, IDFModel, HashingTF}
import org.apache.spark.mllib.linalg.Vector
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.rdd.RDD

import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute

import java.io.StringReader

import scala.collection.mutable

/** Define Preparator parameters. Recall that for our data
  * representation we are only required to input the n-gram window
  * components.
  */
case class PreparatorParams(
  nGram: Int,
  numFeatures: Int = 15000
) extends Params

/** define your Preparator class */
class Preparator(pp: PreparatorParams)
  extends PPreparator[TrainingData, PreparedData] {

  def prepare(sc: SparkContext, td: TrainingData): PreparedData = {

    val tfHasher = new TFHasher(pp.numFeatures, pp.nGram, td.stopWords)

    // Convert trainingdata's observation text into TF vector
    // and then fit a IDF model
    val idf: IDFModel = new IDF().fit(td.data.map(e => tfHasher.hashTF(e.appId, e.text)))

    val tfIdfModel = new TFIDFModel(
      hasher = tfHasher,
      idf = idf
    )

    // Transform RDD[Observation] to RDD[(Label, appId, text)]
    val doc: RDD[(Double, String)] = td.data.map (obs => (obs.label, obs.appId, obs.text))

    // transform RDD[(Label, text)] to RDD[LabeledPoint]
    val transformedData: RDD[(LabeledPoint)] = tfIdfModel.transform(doc)

    // Finally extract category map, associating label to category.
    val categoryMap = td.data.map(obs => (obs.label, obs.category)).collectAsMap.toMap

    new PreparedData(
      tfIdf = tfIdfModel,
      transformedData = transformedData,
      categoryMap = categoryMap
    )
  }

}

class TFHasher(
  val numFeatures: Int,
  val nGram: Int,
  val stopWords:Set[String]
) extends Serializable {

  private val hasher = new HashingTF(numFeatures = numFeatures)

/** Use Lucene StandardAnalyzer to tokenize text **/
 def tokenize(content: String): Seq[String] = {
    val tReader = new StringReader(content)
    val analyzer = new StandardAnalyzer()
    val tStream = analyzer.tokenStream("contents", tReader)
    val term = tStream.addAttribute(classOf[CharTermAttribute])
    tStream.reset()

    val result = mutable.ArrayBuffer.empty[String]
    while (tStream.incrementToken()) {
      val termValue = term.toString

        result += term.toString

    }
    result
}


  /** Hashing function: Text -> term frequency vector. */
  def hashTF(appId: String, text: String): Vector = {

    //Todo: figure out how to use appId

    val newList : Array[String] = tokenize(text)
    .filterNot(stopWords.contains(_))
    .sliding(nGram)
    .map(_.mkString)
    .toArray

    hasher.transform(newList)
  }
}

class TFIDFModel(
  val hasher: TFHasher,
  val idf: IDFModel
) extends Serializable {

  /** trasform text to tf-idf vector. */
  def transform(appId: String, text: String): Vector = {
    // Map(n-gram -> document tf)
    idf.transform(hasher.hashTF(appId, text))
  }

  /** transform RDD of (label, appId, text) to RDD of LabeledPoint */
  def transform( doc: RDD[(Double, String, String)]): RDD[LabeledPoint] = {
    doc.map{ case (label, appId, text) => LabeledPoint(label, transform(appId, text)) }
  }
}

class PreparedData(
  val tfIdf: TFIDFModel,
  val transformedData: RDD[LabeledPoint],
  val categoryMap: Map[Double, String]
) extends Serializable
