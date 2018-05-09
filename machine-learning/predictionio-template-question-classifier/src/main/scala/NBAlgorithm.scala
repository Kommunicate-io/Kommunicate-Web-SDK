package org.template.textclassification

import org.apache.predictionio.controller.P2LAlgorithm
import org.apache.predictionio.controller.Params
import org.apache.spark.SparkContext
import org.apache.spark.mllib.classification.NaiveBayes
import org.apache.spark.mllib.classification.NaiveBayesModel
import org.apache.spark.mllib.linalg.Vector

import scala.math._

/** Define parameters for Supervised Learning Model. We are
 * using a Naive Bayes classifier, which gives us only one
 * hyperparameter in this stage.
 */
case class NBAlgorithmParams(lambda: Double) extends Params

/** Define SupervisedAlgorithm class. */
class NBAlgorithm(
  val ap: NBAlgorithmParams
) extends P2LAlgorithm[PreparedData, NBModel, Query, PredictedResult] {

  /** Train your model. */
  def train(sc: SparkContext, pd: PreparedData): NBModel = {
    // Fit a Naive Bayes model using the prepared data.
    val nb: NaiveBayesModel = NaiveBayes.train(pd.transformedData, ap.lambda)

    new NBModel(
      tfIdf = pd.tfIdf,
      categoryMap = pd.categoryMap,
      nb = nb)
  }

  /** Prediction method for trained model. */
  def predict(model: NBModel, query: Query): PredictedResult = {
    model.predict(query.appId, query.text)
  }
}

class NBModel(
  val tfIdf: TFIDFModel,
  val categoryMap: Map[Double, String],
  val nb: NaiveBayesModel
) extends Serializable {

  private def innerProduct (x : Array[Double], y : Array[Double]) : Double = {
    x.zip(y).map(e => e._1 * e._2).sum
  }

  val normalize = (u: Array[Double]) => {
    val uSum = u.sum

    u.map(e => e / uSum)
  }

  private val scoreArray = nb.pi.zip(nb.theta)

  /** Given a document string, return a vector of corresponding
    * class membership probabilities.
    * Helper function used to normalize probability scores.
    * Returns an object of type Array[Double]
    */
  private def getScores(doc: String): Array[Double] = {
    // Vectorize query
    val x: Vector = tfIdf.transform(doc)

    val z = scoreArray
      .map(e => innerProduct(e._2, x.toArray) + e._1)

    normalize((0 until z.size).map(k => exp(z(k) - z.max)).toArray)
  }

  /** Implement predict method for our model using
    * the prediction rule given in tutorial.
    */
  def predict(appId: String, doc : String) : PredictedResult = {
  
    //Todo: figure out how to use appId

    val x: Array[Double] = getScores(doc)
    val y: (Double, Double) = (nb.labels zip x).maxBy(_._2)
    PredictedResult(categoryMap.getOrElse(y._1, ""), y._2)
  }
}
