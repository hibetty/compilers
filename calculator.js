function Calculator(inputString){
  this.tokenStream = this.lexer(inputString);
}

Calculator.prototype.lexer = function(inputString){
  var tokenTypes = [
    ['NUMBER', /^\d+/],
    ['ADD', /^\+/],
    ['SUB', /^\-/],
    ['MUL', /^\*/],
    ['DIV', /^\//],
    ['LPAREN', /^\(/],
    ['RPAREN', /^\)/],
  ];
  var arrObjects = inputString.split('').map(function(str){
    var obj = {};
    for (var i = 0; i < tokenTypes.length; i++){
      if (str.search(tokenTypes[i][1]) !== -1){
        obj.name = tokenTypes[i][0];
        obj.value = str;
      }
    }
    if (Object.keys(obj).length !== 2) throw new Error('Unparsable token');

    return obj;
  });

  return arrObjects;
};

Calculator.prototype.peek = function(){
  return this.tokenStream[0] || null;
};

Calculator.prototype.get = function(){
  return this.tokenStream.shift();
};

Calculator.prototype.parseExpression = function(){
  var term = this.parseTerm();
  var a = this.parseA();

  return new TreeNode('Expression', term, a);
};

Calculator.prototype.parseA = function(){
  var nextToken = this.peek();

  if (nextToken && nextToken.name === 'ADD'){
    this.get();
    return new TreeNode('A', '+', this.parseTerm(), this.parseA());
  } else if (nextToken && nextToken.name === 'SUB'){
    this.get();
    return new TreeNode('A', '-', this.parseTerm(), this.parseA());
  } else {
    return new TreeNode('A');
  }
};

Calculator.prototype.parseTerm = function(){
  this.get();
  return new TreeNode('T', this.parseF(), this.parseB());
};

Calculator.prototype.parseB = function(){
  var nextToken = this.peek();

  if (nextToken && nextToken.name === 'MUL'){
    this.get();
    return new TreeNode('B', '*', this.parseF(), this.parseB());
  } else if (nextToken && nextToken.name === 'DIV'){
    this.get();
    return new TreeNode('B', '/', this.parseF(), this.parseB());
  } else {
    return new TreeNode('B');
  }
};

Calculator.prototype.parseF = function(){
  var nextToken = this.peek();

  if (nextToken && nextToken.name === 'LPAREN'){
    this.get();
    var expression = this.parseExpression();
    this.get();
    return new TreeNode('F', '(', expression, ')');
  } else if (nextToken && nextToken.name === 'SUB'){
    this.get();
    return new TreeNode('F', '-', this.parseF());
  } else {
    return new TreeNode(this.get());
  }
};

function TreeNode(name, ...children){
  this.name = name;
  this.children = children;
}

// var calc = new Calculator('1+(2*3)+4');
// //console.log(calc.tokenStream);
// console.log(calc.get());
// console.log(calc.peek());
// console.log(calc.tokenStream);

// var node = new TreeNode('awesome', 1, 3, 4, 5);
// console.log(node.name);
// console.log(node.children);

// var calculator = new Calculator("(3)");

// // make a fake version of parseExpression
// var fakeExpressionTreeNode = new TreeNode("Expression", "3");
// calculator.parseExpression = function() {
//   this.get(); // remove the 3 when parseFactor runs
//   return fakeExpressionTreeNode;
// };

// var output = calculator.parseF();
// // check that
// console.log(output.name);
// // output.name == "Factor"
// console.log(output.children);
// // output.children = ["(", fakeExpressionTreeNode, ")"];
