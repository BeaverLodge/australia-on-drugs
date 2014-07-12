window.Questionator = function() {
  var self = this;

  this.showMeThem = function(callback) {
    var questions = {};
    d3.csv("../data/variabledefinitions.csv")
      .row(function(d) { return d; })
      .get(function(error, rows) {
        _(rows).each(function(row) {
          if (questions[row.Variable] == undefined) { questions[row.Variable] = {answers: []}; }
          questions[row.Variable].answers[row.Value] = row.Label;
        });
        d3.csv("../data/variabledescriptions.csv")
          .row(function(d) {return d; })
          .get(function(error, rows) {
            _(rows).each(function(row) {
              if (questions[row.Variable]) {
                questions[row.Variable]['question'] = row.Label;
              }
            });
          callback(questions);
          });
      });
  }
}