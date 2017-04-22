function Calculator(inputString){
  this.tokenStream = this.lexer(inputString);
}

Calculator.prototype.lexer = function(inputString){
  //returns an array of objects, each with properties 'name' and 'value'

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

var whee = new Calculator('hello');
console.log(whee.tokenStream);
