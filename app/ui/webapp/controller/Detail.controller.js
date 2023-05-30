sap.ui.define([
    "LABS/ui/controller/Base",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, Controller, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("LABS.ui.controller.Detail", {
		onInit: function () {
			var oExitButton = this.getView().byId("exitFullScreenBtn"),
				oEnterButton = this.getView().byId("enterFullScreenBtn");

            this.oModel = this.getOwnerComponent().getModel("layout");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detail").attachPatternMatched(this._onRoomMatched, this);

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

            this.getView().setModel(new JSONModel({
                edit: false
            }), "screenMode");
		},
		
        _onRoomMatched: function (oEvent) {
            //handle nav layout
            this.oModel.setProperty("/isFullScreen", false);

            //reset mode model
            this.getView().getModel("screenMode").setData({
                edit: false
            })

			this._roomId = oEvent.getParameter("arguments").room;
			this.getView().bindElement({
				path: `/Rooms/${this._roomId}`,
                parameters: {
                    $$updateGroupId: "roomEdit"
                }
			});

            this.byId("scheduleTable").bindElement({
				path: `/MovieToRoomMapping/${this._roomId}`,
                parameters: {
                    $$updateGroupId: "movieEdit"
                }
			});
		},

        handleEdit: function(oEvent){
            this.getView().getModel("screenMode").setProperty("/edit", true);
        },

        handleCancel: function(oEvent){
            this.getView().getModel("screenMode").setProperty("/edit", false);
            this.getView().getModel().resetChanges("roomEdit");
        },

        onAddMapping: function(oEvent){
            const oTable = this.getView().byId("scheduleTable");
            const oNewContext = oTable.getBinding("items").create({
                ROOM_ID: parseInt(this._roomId),
                NEW: true,
                MOVIE_ID: null,
                DAY: null,
                START_TIME: null
            });

            oNewContext.created().catch((err)=>{});
        },

        onDeleteMapping: function(oEvent){
            const oTable = this.getView().byId("scheduleTable");
            oTable.getSelectedItems().forEach(item => {
                item.getBindingContext().delete("$auto").catch(function(err){
                    console.log(err.message)
                });
            })
        },

        handleSave: function(oEvent){
            //clear message manager model
            sap.ui.getCore().getMessageManager().removeAllMessages();
            
            this.getView().getModel().submitBatch("roomEdit").then(function(){
                //check for error messages
                const aMsg = sap.ui.getCore().getMessageManager().getMessageModel().getData();
                if(aMsg.length && aMsg[0].type === "Error"){
                    MessageBox.error(aMsg[0].message);
                    this.getView().getModel().resetChanges("roomEdit");
                    return
                }
                
                //handle successfull call
                sap.m.MessageToast.show("Changes successfully submitted");
                this.getView().getModel().refresh();
                this.getView().getModel("screenMode").setProperty("/edit", false);                
            }.bind(this)).catch(function(err){
                this.getView().getModel().resetChanges("roomEdit");
                MessageBox.error(err.message);
            });
        },

        handleDeleteRoom: function(oEvent){
            this.getView().getBindingContext().delete("$auto").then(function(){
                sap.m.MessageToast.show("Deletion successful");
                this.getView().getModel().refresh();
                this.handleCloseColumn();
            }.bind(this)).catch(function(err){
                MessageBox.error(err.message)
            });
        }
	});
});