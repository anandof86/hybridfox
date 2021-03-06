var ec2_AMIMigrator = {
    image : null,
    session : null,
    retVal : null,
    manifest : null,
    regionSelected : null,

    getSourceBucketName : function() {
        return document.getElementById("ec2ui.migrateAMI.bucketName.source");
    },

    getDestBucketName : function() {
        return document.getElementById("ec2ui.migrateAMI.bucketName.dest");
    },

    getPrefix : function() {
        return document.getElementById("ec2ui.migrateAMI.prefix");
    },

    getRegionList : function() {
        return document.getElementById("ec2ui.migrateAMI.regions");
    },

    validateBucketName : function() {
        var bucketLower = this.retVal.destB.toLowerCase();

        return (bucketLower == this.retVal.destB);
    },

    allowEdit : function() {
        this.getDestBucketName().disabled = false;
        this.getPrefix().disabled = false;
    },

    regionChanged : function() {
        var parts = this.image.location.split('/');
        var reg = this.getRegionList().selectedItem.label;
        reg = reg.split("-")[0];
        this.regionSelected = reg.toUpperCase();
        this.getDestBucketName().value = parts[0] + "-" + reg;
    },

    migrateAMI : function() {
        var bucketNameBox = this.getDestBucketName();

        this.retVal.sourceB = this.getSourceBucketName().value;
        this.retVal.destB = bucketNameBox.value;

        if (!this.validateBucketName()) {
            alert (ec2ui_utils.getMessageProperty("ec2ui.msg.migrateAMIDialog.alert.migrateAMI"));
            bucketNameBox.select();
            return false;
        } else {
            this.retVal.prefix = this.getPrefix().value;
            this.retVal.region = this.regionSelected;
            this.retVal.ok = true;
            return true;
        }
    },

    init : function() {
        this.image = window.arguments[0];
        this.session = window.arguments[1];
        this.retVal = window.arguments[2];

        if (this.image == null)
        {
            log("Image is NULL");
            return false;
        }

        // Populate the regions
        var endpointlist = this.session.getEndpoints();
        var active = this.session.getActiveEndpoint();

        var regionList = this.getRegionList();

        for (var i = 0; i < endpointlist.length; ++i) {
            var curr = endpointlist[i];
            if (curr.name == active.name) {
                continue;
            }
            regionList.appendItem(curr.name);
        }

        regionList.selectedIndex = 0;

        // Populate the text fields
        var parts = this.image.location.split('/');
        if (parts.length != 2)
        {
            log("Invalid manifest. " + this.manifest);
            return false;
        }

        document.getElementById("ec2ui.migrateAMI.id").value = this.image.id;
        var reg = this.getRegionList().selectedItem.label;
        reg = reg.split("-")[0];
        this.regionSelected = reg.toUpperCase();
        this.getSourceBucketName().value = parts[0];
        this.getDestBucketName().value = parts[0] + "-" + reg;
        this.getPrefix().value = parts[1].substring(0, parts[1].indexOf(".manifest.xml"));
    }
}
