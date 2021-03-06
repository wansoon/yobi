/**
 * @(#)hive.issue.List.js 2013.03.13
 *
 * Copyright NHN Corporation.
 * Released under the MIT license
 * 
 * http://hive.dev.naver.com/license
 */

(function(ns){
	
	var oNS = $hive.createNamespace(ns);
	oNS.container[oNS.name] = function(htOptions){

		var htVar = {};
		var htElement = {};
		
		/**
		 * initialize
		 */
		function _init(htOptions){
			_initVar(htOptions || {})
			_initElement(htOptions || {});
			_attachEvent();
			
			_initLabel(htOptions.htOptLabel);
			
			_initPagination();
			_setLabelColor();
		}
		
		/**
		 * initialize variables except element
		 */
		function _initVar(htOptions){
			htVar.nTotalPages = htOptions.nTotalPages || 1;
			htVar.oTypeahead = new hive.ui.Typeahead("input[name=authorLoginId]", {
				"sActionURL": "/users"
			});
            htVar.sIssueCheckBoxesSelector = htOptions.sIssueCheckBoxesSelector;
		}
		
		/**
		 * initialize element
		 */
		function _initElement(htOptions){
			htElement.welContainer  = $(".inner");
			htElement.welBtnAdvance = $(".btn-advanced");		
			htElement.welPagination = $(htOptions.elPagination || "#pagination");

			htElement.waLabels    = $("button.issue-label[data-color]"); // 목록 > 라벨

            htElement.welMassUpdateForm = htOptions.welMassUpdateForm;
            htElement.welMassUpdateButtons = htOptions.welMassUpdateButtons;

            htElement.oState = new hive.ui.Dropdown({
                "elContainer": htOptions.welState
            });

            htElement.oMilestone = new hive.ui.Dropdown({
                "elContainer": htOptions.welMilestone
            });

            htElement.oAssignee = new hive.ui.Dropdown({
                "elContainer": htOptions.welAssignee
            });


		}
		
		/**
		 * attach event handlers
		 */
		function _attachEvent(){
			htElement.welBtnAdvance.click(_onClickBtnAdvance);
            htElement.oState.onChange(_onChangeUpdateField);
            htElement.oMilestone.onChange(_onChangeUpdateField);
            htElement.oAssignee.onChange(_onChangeUpdateField);
            $(htVar.sIssueCheckBoxesSelector).change(_onCheckIssue);
		}

        /**
         * When check an issue, enable Mass Update dropdowns if only one or
         * more issues are checked, otherwise disable them.
         */
        function _onCheckIssue() {
            htElement.welMassUpdateButtons.attr('disabled', true);
            $(htVar.sIssueCheckBoxesSelector + ':checked').each(function() {
                htElement.welMassUpdateButtons.removeAttr('disabled');
            });
        }

        /**
         * When change the value of any field in the Mass Update form, submit
         * the form and request to update issues.
         */
        function _onChangeUpdateField() {
            var nCnt = 0;
            var welForm = htElement.welMassUpdateForm;
            var fAddCheckedIssueId = function() {
                welForm.append(
                    $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', 'issues[' + (nCnt++) + '].id')
                        .attr('value', $(this).data('issue-id'))
                );
            }

            $(htVar.sIssueCheckBoxesSelector + ':checked')
                .each(fAddCheckedIssueId);

            welForm.submit();
        }

		/**
		 * 상세검색 영역 토글
		 */
		function _onClickBtnAdvance(){
			htElement.welContainer.toggleClass("advanced");
	   	}

		/**
		 * initialize hive.Label
		 * @param {Hash Table} htOptions
		 */
		function _initLabel(htOptions){		
			hive.Label.init(htOptions);
		}
		
		/**
		 * update Pagination
		 * @requires hive.Pagination
		 */
		function _initPagination(){
			hive.Pagination.update(htElement.welPagination, htVar.nTotalPages);
		}
		
		/**
		 * update Label color
		 */
		function _setLabelColor(){
			var welLabel, sColor;
			
			htElement.waLabels.each(function(){
				welLabel = $(this);
				sColor = welLabel.data("color");
				welLabel.css("background-color", sColor);
				welLabel.css("color", $hive.getContrastColor(sColor));
		    });
			
			welLabel = sColor = null;
		}

		_init(htOptions);
	};
	
})("hive.issue.List");
