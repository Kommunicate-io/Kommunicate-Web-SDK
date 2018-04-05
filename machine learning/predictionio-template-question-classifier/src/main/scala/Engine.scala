package org.template.textclassification

import org.apache.predictionio.controller.EngineFactory
import org.apache.predictionio.controller.Engine

/** Define Query class which serves as a wrapper for
  * new text data.
  */
case class Query(appId: String, text: String)

/** Define PredictedResult class which serves as a
  * wrapper for a predicted class label and the associated
  * prediction confidence.
  */
case class PredictedResult(
  category: String,
  confidence: Double)

/** Define ActualResult class which serves as a wrapper
  * for an observation's true class label.
  */
case class ActualResult(category: String)

/** Define Engine */
object TextClassificationEngine extends EngineFactory {
  def apply() = {
    new Engine(
      classOf[DataSource],
      classOf[Preparator],
      Map(
        "nb" -> classOf[NBAlgorithm],
        "lr" -> classOf[LRAlgorithm]
      ),
      classOf[Serving])
  }
}
