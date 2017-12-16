# Text Classification Engine

Look at the following
[tutorial](http://predictionio.incubator.apache.org/demo/textclassification/)
for a Quick Start guide and implementation details.

# Release Information

## Version 6.0

- Use Apache Lucene as tokenizer
- Add stopwords filter
- Rename Scala package name
- Update SBT version

## Version 5.0 **First Apache Version**

- Major changes to namespace to reflect donation to the Apache Software Foundation.
- Build changes to support modified Apache build mechanism

## Version 4.0

Re-structure and design preparator and algo. less memory usage and run time is faster.
Move BIDMach, VW & SPPMI algo changes to `bidmach` branch temporarily.

## Version 3.1

Fix DataSource to read "content", "e-mail", and use label "spam" for tutorial data.
Fix engine.json for default algorithm setting.


## Version 2.2

Modified PreparedData to use MLLib hashing and tf-idf implementations.

## Version 2.1

Fixed dot product implementation in the predict methods to work with batch predict method for evaluation.

## Version 2.0

Included three different data sets: e-mail spam, 20 newsgroups, and the rotten tomatoes semantic analysis set. Includes Multinomial Logistic Regression algorithm for text classification.

## Version 1.2

Fixed import script bug occuring with Python 2.

## Version 1.1 Changes

Changed data import Python script to pull straight from the [20 newsgroups](http://qwone.com/~jason/20Newsgroups/) page.
