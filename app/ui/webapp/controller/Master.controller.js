sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return Controller.extend("LABS.ui.controller.Master", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
		},
        
		onSearch: function (oEvent) {
			var aSearchFilters = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
                //add string filter
				aSearchFilters = [new Filter("NAME", FilterOperator.Contains, sQuery)];

                //add integer filter if search value is of type number
                if(!isNaN(parseInt(sQuery))){
                    aSearchFilters.push(
                        new Filter("ROOM_ID", FilterOperator.EQ, parseInt(sQuery)),
                        new Filter("CAPACITY", FilterOperator.EQ, parseInt(sQuery))
                    )
                }
			}

            this.getView().byId("roomsTable").getBinding("items").filter(new Filter({
                and: false,
                filters: aSearchFilters
            }), "Application");
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("roomsTable"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("ROOM_ID", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

        onAdd: function (oEvent) {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.oRouter.navTo("new", {layout: oNextUIState.layout});
		},

        onRoomPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			var sRoomID = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("ROOM_ID");

			this.oRouter.navTo("detail", {layout: oNextUIState.layout, room: sRoomID});
		}
	});
});