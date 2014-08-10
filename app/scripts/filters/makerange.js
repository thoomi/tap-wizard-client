'use strict';

////////////////////////////////////////////////////////////////////////////////
/// A filter to generate a new array with the in _input specified parameters.
/// This filter is primarly needed for the ng-reapeat directive.
/// Usage examples:
///
/// <div ng-repeat="n in [10] | makeRange">Do something 0..9: {{n}}</div>
/// or
/// <div ng-repeat="n in [20, 29] | makeRange">Do something 20..29: {{n}}</div>
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .filter('makeRange', function () {
    return function (_input) {
		var lowBound, highBound;

		switch (_input.length) {
			case 1:
			    lowBound = 0;
			    highBound = parseInt(_input[0]) - 1;
			    break;
			case 2:
			    lowBound = parseInt(_input[0]);
			    highBound = parseInt(_input[1]);
			    break;
			default:
			    return _input;
		}

		var result = [];
		for (var i = lowBound; i <= highBound; i++)
		{
			result.push(i);
		}
		    
		return result;
    };
  });
