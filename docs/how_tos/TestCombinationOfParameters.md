<a id="top"></a>

# How to Test Combinations of Parameters

<!-- toc -->

## Contents

- [Why use Combinations](#why-use-combinations)
  - [Cartesian product](#cartesian-product)
- [Steps](#steps)
- [See Also](#see-also)<!-- endToc -->

## Why use Combinations

Combination Approvals allows you to test hundreds of calls to a function using different parameter values with just a few lines of code.

For example, you have a function that takes 3 parameters, and you want to test its behaviour with a bunch of different values for each of those parameters.

### Cartesian product

Combinations will test the Cartesian product of all possibilities for each parameter.

For example:

If you have **3 names**, **4 ages** and **5 cities**,
it will call the function being tested with all
[3 X 4 X 5] = **60 permutations** of the arguments.

## Steps

1. Copy this starter text, and adjust for the number of inputs that you have.

<!-- snippet: CombinationsStartingPoint -->

<a id='snippet-CombinationsStartingPoint'></a>

```mts
test("CombinationsStartingPoint", () => {
  const inputs1 = ["input1.value1", "input1.value2"];
  const inputs2 = ["input2.value1", "input2.value2", "input2.value3"];
  verifyAllCombinations2(
    (a, b) => `placeholder for ${a}, ${b}`,
    inputs1,
    inputs2,
  );
});
```

<sup><a href='/test/Providers/Jest/CombinationApprovals.test.mts#L129-L139' title='Snippet source file'>snippet source</a> | <a href='#snippet-CombinationsStartingPoint' title='Start of snippet'>anchor</a></sup>

<!-- endSnippet -->

2. Modify each input container for your chosen values.
3. Make sure each input type can be converted to a string (See [Tips for Designing Strings](https://approvaltestscpp.readthedocs.io/en/latest/generated_docs/explanations/TipsForDesigningStrings.html))
4. Run it, and make sure that you have your inputs wired up correctly.

If they are wired up correctly, you will see a file that looks like this: it is the left hand side of the file that
matters at this point: all combinations of your own input values should be listed:

<!-- snippet: CombinationApprovals.test.documentation_CombinationsStartingPoint.approved.txt -->

<a id='snippet-CombinationApprovals.test.documentation_CombinationsStartingPoint.approved.txt'></a>

```txt
[input1.value1,input2.value1] => placeholder for input1.value1, input2.value1
[input1.value1,input2.value2] => placeholder for input1.value1, input2.value2
[input1.value1,input2.value3] => placeholder for input1.value1, input2.value3
[input1.value2,input2.value1] => placeholder for input1.value2, input2.value1
[input1.value2,input2.value2] => placeholder for input1.value2, input2.value2
[input1.value2,input2.value3] => placeholder for input1.value2, input2.value3
```

<sup><a href='/test/Providers/Jest/CombinationApprovals.test.documentation_CombinationsStartingPoint.approved.txt#L1-L6' title='Snippet source file'>snippet source</a> | <a href='#snippet-CombinationApprovals.test.documentation_CombinationsStartingPoint.approved.txt' title='Start of snippet'>anchor</a></sup>

<!-- endSnippet -->

5. Implement the body of your lambda
6. Run it, and approve the output.

## See Also

- [Combinations Approvals](../reference/CombinationApprovals.md)

---

[Back to User Guide](/doc/README.md#top)
