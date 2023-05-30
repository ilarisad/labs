sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "LABS/ui/model/models",
        "sap/ui/model/json/JSONModel",
        "sap/f/FlexibleColumnLayoutSemanticHelper"
    ],
    function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper) {
        "use strict";

        return UIComponent.extend("LABS.ui.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                //set FCL layout model
                var oLayoutModel = new JSONModel();
			    this.setModel(oLayoutModel, "layout");

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },

            getHelper: function () {
                var oFCL = this.getRootControl().byId("fcl"),
                oParams = jQuery.sap.getUriParameters(),
                    oSettings = {
                        defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
                        initialColumnsCount: 1
                    };
    
                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            }
        });
    }
);