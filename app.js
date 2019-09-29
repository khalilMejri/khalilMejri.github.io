
var app = new Vue({
    el: '#app',
    data: {
        scanner: null,
        activeCameraId: null,
        cameras: [],
        scans: [],
        properties: [Object]
    },
    mounted: function () {
        var self = this;

        self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: false, scanPeriod: 5 });
        self.scanner.addListener('scan', function (content, image) {
            self.scans.unshift({ date: +(Date.now()), content: content });
            // do whatever with scanned code
            self.properties = [Object];
            var productInfos = {
                "Ref": content,
                "Display": "21.5-inch (diagonal) Retina 4K display",
                "Processor": "3.6GHz quad‑core Intel Core i3",
                "Memory": "8GB of 2400MHz DDR4 memory",
                "Storage": "1TB (5400-rpm) hard drive",
                "Grapihcs": "Radeon Pro 555X with 2GB of GDDR5 memory",
                "Video Support and Camera": "FaceTime HD camera <br> Simultaneously supports full native resolution on the built-in display at millions of colors (21.5-inch) or 1 billion colors (21.5-inch 4K)",
                "Audio": "Stereo speakers <br> Microphone <br> 3.5 mm headphone jack",
                "Size and Weight": "21.5-inch iMac <br> Height: 17.7 inches (45.0 cm) <br>  Width: 20.8 inches (52.8 cm) <br> Stand depth: 6.9 inches (17.5 cm) <br> Weight: 12.5 pounds (5.66 kg)2"
            }
            for (var key in productInfos) {
                if (productInfos.hasOwnProperty(key)) {
                    self.properties.push({ mKey: key, value: productInfos[key] });
                }
            }
            console.log(self.properties);

        });
        Instascan.Camera.getCameras().then(function (cameras) {
            self.cameras = cameras;
            if (cameras.length > 0) {
                self.activeCameraId = cameras[0].id;
                self.scanner.start(cameras[0]);
                console.log(cameras);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
    },
    methods: {
        formatName: function (name) {
            return name || 'Integrated Webcam';
        },
        selectCamera: function (camera) {
            this.activeCameraId = camera.id;
            this.scanner.start(camera);
        },
        stopScan: function () {
            this.scanner.stop().then(function (error) {
                // save last snapshot
            })
            this.activeCameraId = null;

        }
    }
});
