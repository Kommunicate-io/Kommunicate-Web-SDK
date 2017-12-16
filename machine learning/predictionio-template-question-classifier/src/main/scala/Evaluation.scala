package org.template.textclassification

import org.apache.predictionio.controller.AverageMetric
import org.apache.predictionio.controller.Evaluation
import org.apache.predictionio.controller.EmptyEvaluationInfo
import org.apache.predictionio.controller.EngineParamsGenerator
import org.apache.predictionio.controller.EngineParams

/** Create an accuracy metric for evaluating our supervised learning model. */
case class Accuracy()
  extends AverageMetric[EmptyEvaluationInfo, Query, PredictedResult, ActualResult] {

  /** Method for calculating prediction accuracy. */
  def calculate(
    query: Query,
    predicted: PredictedResult,
    actual: ActualResult
  ) : Double = if (predicted.category == actual.category) 1.0 else 0.0
}


/** Define your evaluation object implementing the accuracy metric defined
  * above.
  */
object AccuracyEvaluation extends Evaluation {

  // Define Engine and Metric used in Evaluation.
  engineMetric = (
    TextClassificationEngine(),
    Accuracy()
  )
}

/** Set your engine parameters for evaluation procedure.*/
object EngineParamsList extends EngineParamsGenerator {

  // Set data source and preparator parameters.
  private[this] val baseEP = EngineParams(
    dataSourceParams = DataSourceParams(appName = "Applozic", evalK = Some(3)),
    preparatorParams = PreparatorParams(nGram = 2, numFeatures = 500)
  )

  // Set the algorithm params for which we will assess an accuracy score.
  engineParamsList = Seq(
    baseEP.copy(algorithmParamsList = Seq(("nb", NBAlgorithmParams(0.25)))),
    baseEP.copy(algorithmParamsList = Seq(("nb", NBAlgorithmParams(1.0)))),
    baseEP.copy(algorithmParamsList = Seq(("lr", LRAlgorithmParams(0.5)))),
    baseEP.copy(algorithmParamsList = Seq(("lr", LRAlgorithmParams(1.25))))
  )
}
