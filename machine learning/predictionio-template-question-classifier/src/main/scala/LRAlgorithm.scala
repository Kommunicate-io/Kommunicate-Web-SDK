package org.template.textclassification

import org.apache.predictionio.controller.P2LAlgorithm
import org.apache.predictionio.controller.Params
import org.apache.spark.SparkContext
import org.apache.spark.ml.classification.LogisticRegression
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.functions
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.expressions.UserDefinedFunction
import grizzled.slf4j.Logger
import org.apache.spark.mllib.regression.LabeledPoint

case class LRAlgorithmParams(regParam: Double) extends Params

class LRAlgorithm(val ap: LRAlgorithmParams)
  extends P2LAlgorithm[PreparedData, LRModel, Query, PredictedResult] {

  @transient lazy val logger = Logger[this.type]

  def train(sc: SparkContext, pd: PreparedData): LRModel = {

    // Import SQLContext for creating DataFrame.
    val sql: SQLContext = new SQLContext(sc)
    import sql.implicits._

    val lr = new LogisticRegression()
      .setMaxIter(10)
      .setThreshold(0.5)
      .setRegParam(ap.regParam)

    val labels: Seq[Double] = pd.categoryMap.keys.toSeq

    val data = labels.foldLeft(pd.transformedData.map { case LabeledPoint(label, feature) =>
      // Convert old LabeledPoint to ML's LabeledPoint
      new org.apache.spark.ml.feature.LabeledPoint(label, feature.asML)
    }.toDF)( //transform to Spark DataFrame
      // Add the different binary columns for each label.
      (data: DataFrame, label: Double) => {
        // function: multiclass labels --> binary labels
        val f: UserDefinedFunction = functions.udf((e : Double) => if (e == label) 1.0 else 0.0)

        data.withColumn(label.toInt.toString, f(data("label")))
      }
    )

    // Create a logistic regression model for each class.
    val lrModels : Seq[(Double, LREstimate)] = labels.map(
      label => {
        val lab = label.toInt.toString

        val fit = lr.setLabelCol(lab).fit(
          data.select(lab, "features")
        )

        // Return (label, feature coefficients, and intercept term.
        (label, LREstimate(fit.coefficients.toArray, fit.intercept))

      }
    )

    new LRModel(
      tfIdf = pd.tfIdf,
      categoryMap = pd.categoryMap,
      lrModels = lrModels
    )
  }

  def predict(model: LRModel, query: Query): PredictedResult = {
    model.predict(query.text)
  }
}

case class LREstimate (
  coefficients : Array[Double],
  intercept : Double
)

class LRModel(
  val tfIdf: TFIDFModel,
  val categoryMap: Map[Double, String],
  val lrModels: Seq[(Double, LREstimate)]) extends Serializable {

  /** Enable vector inner product for prediction. */
  private def innerProduct (x : Array[Double], y : Array[Double]) : Double = {
    x.zip(y).map(e => e._1 * e._2).sum
  }

  /** Define prediction rule. */
  def predict(text: String): PredictedResult = {
    val x: Array[Double] = tfIdf.transform(text).toArray

    // Logistic Regression binary formula for positive probability.
    // According to MLLib documentation, class labeled 0 is used as pivot.
    // Thus, we are using:
    // log(p1/p0) = log(p1/(1 - p1)) = b0 + xTb =: z
    // p1 = exp(z) * (1 - p1)
    // p1 * (1 + exp(z)) = exp(z)
    // p1 = exp(z)/(1 + exp(z))
    val pred = lrModels.map(
      e => {
        val z = scala.math.exp(innerProduct(e._2.coefficients, x) + e._2.intercept)
        (e._1, z / (1 + z))
      }
    ).maxBy(_._2)

    PredictedResult(categoryMap(pred._1), pred._2)
  }

  override def toString = s"LR model"
}
