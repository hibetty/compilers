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
  } else if(nextToken.name === 'NUMBER') {
    return new TreeNode('F', this.get().value);
  }
};

function TreeNode(name, ...children){
  this.name = name;
  this.children = children;
}

TreeNode.prototype.accept = function(visitor){
  return visitor.visit(this);
};

function InfixVisitor(){
  this.visit = function(node) {
    switch (node.name){
      case 'Expression':
        return node.children[0].accept(this) + node.children[1].accept(this);
        break;

      case 'T':
        return node.children[0].accept(this) + node.children[1].accept(this);
        break;

      case 'A':
        if (node.children.length > 0){
          return node.children[0] + node.children[1].accept(this) + node.children[2].accept(this);
        } else {
          return '';
        }
        break;

      case 'F':
        if (node.children.length === 3){
          return node.children[0] + node.children[1].accept(this) + node.children[2];
        } else if (node.children.length === 2){
          return node.children[0] + node.children[1].accept(this);
        } else {
          return node.children[0];
        }
        break;

      case 'B':
        if (node.children.length > 0){
          return node.children[0] + node.children[1].accept(this) + node.children[2].accept(this);
        } else {
          return '';
        }
        break;

      default:
        break;
    }
  };
}

var calc = new Calculator('1+3*4');
var tree = calc.parseExpression();
var printInfix = new InfixVisitor();
console.log(tree.accept(printInfix));
