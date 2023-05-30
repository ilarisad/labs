sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

    return Controller.extend("LABS.ui.controller.Base", {
        getMainContainer: function () {
			return this.getOwnerComponent().getRootControl().byId("fcl");
		},
        handleFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = "MidColumnFullScreen";
            this.getMainContainer().setLayout(sNextLayout);
            this.oModel.setProperty("/isFullScreen", true);
		},
		handleExitFullScreen: function () {
			this.bFocusFullScreenButton = true;
			var sNextLayout = "TwoColumnsMidExpanded";
            this.getMainContainer().setLayout(sNextLayout);
            this.oModel.setProperty("/isFullScreen", false);
		},
		handleCloseColumn: function () {
			var sNextLayout = "OneColumn";
			this.oRouter.navTo("master", {layout: sNextLayout});
            this.oModel.setProperty("/isFullScreen", true);
		}
    });
	
});