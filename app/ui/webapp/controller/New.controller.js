sap.ui.define([
    "LABS/ui/controller/Base",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, Controller, MessageBox) {
	"use strict";

	return BaseController.extend("LABS.ui.controller.New", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel("layout");

			this.oRouter.getRoute("new").attachPatternMatched(this._onNewRoomMatched, this);

			[oExitButton, oEnterButton].forEach(function (oButton) {
				oButton.addEventDelegate({
					onAfterRendering: function () {
						if (this.bFocusFullScreenButton) {
							this.bFocusFullScreenButton = false;
							oButton.focus();
						}
					}.bind(this)
				});
			}, this);

            //set new data JSON Model
            this.getView().setModel(new JSONModel({
                NAME: null,
                CAPACITY: null
            }), "newRoom");
		},

        onSave: function(){
            const oNewData = this.getView().getModel("newRoom").getData();
            // const oAction = this.getView().getModel().bindContext("/deepMovieToRoomMappings(...)");

            let binding = this.getView().getModel().bindList("/Rooms");

            let oContext = binding.create({
                NAME: oNewData.NAME,
                CAPACITY: parseInt(oNewData.CAPACITY)
            });

            var that = this;

            oContext.created().then(function () {
                this.getView().getModel().refresh();
                const sNextLayout = this.getOwnerComponent().getHelper().getNextUIState(1).layout;
                const aMappings = oNewData.mappings.map(obj => { 
                    return {
                        DAY: obj.DAY, 
                        START_TIME: obj.START_TIME, 
                        MOVIE_ID_MOVIE_ID: parseInt(obj.MOVIE_ID)
                    }
                });
    
                let roomMapping = this.getView().getModel().bindList("/MovieToRoomMapping");
                aMappings.forEach(function (data) {
                    let payload = roomMapping.create(data);
                    payload.created().then(function () {
                        this.getView().getModel().refresh();
                    }.bind(this));
                });
                sap.m.MessageToast.show("Room was successfully created");
                this.oRouter.navTo("master", {layout: sNextLayout});
            }.bind(this));
          
           
        },
		
		_onNewRoomMatched: function (oEvent) {
            //handle nav layout
            this.oModel.setProperty("/isFullScreen", false);
            //reset JSON data
			this.getView().getModel("newRoom").setData({
                NAME: null,
                CAPACITY: null
            })
		},
        onAddMapping: function(oEvent){
            const oDataModel = this.getView().getModel("newRoom");
            // const aMappings = oDataModel.getProperty("/mappings");
            oDataModel.setProperty("/mappings", [{DAY: null, START_TIME: null, MOVIE_ID: null, TO_DELETE: false}])
        },
        onDeleteMapping: function(oEvent){
            const oDataModel = this.getView().getModel("newRoom");
            const aRemainingMappings = oDataModel.getProperty("/mappings").filter(map => map.TO_DELETE !== true);
            oDataModel.setProperty("/mappings", aRemainingMappings);
        }
        
	});
});