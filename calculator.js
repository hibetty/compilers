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
    for(var i=0; i<tokenTypes.length; i++){
      if(str.search(tokenTypes[i][1]) != -1){
        obj['name'] = tokenTypes[i][0];
        obj['value'] = str;
      }
    }
    if(Object.keys(obj).length != 2) throw new Error('Unparsable token');

    return obj;
  });

  return arrObjects;
};

Calculator.prototype.peek = function(){
  return this.tokenStream[0] || null;
}

Calculator.prototype.get = function(){
  return this.tokenStream.shift();
}

function TreeNode(name, ...children){
  this.name = name;
  this.children = children;
}

// var calc = new Calculator('1+(2*3)+4');
// //console.log(calc.tokenStream);
// console.log(calc.get());
// console.log(calc.peek());
// console.log(calc.tokenStream);

var node = new TreeNode('awesome', 1, 3, 4, 5);
console.log(node.name);
console.log(node.children);
