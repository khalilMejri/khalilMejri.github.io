var app = new Vue({
    el: '#app',
    data: {
        scanner: null,
        activeCameraId: null,
        cameras: [],
        scans: []
    },
    mounted: function () {
        var self = this;
        self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
        self.scanner.addListener('scan', function (content, image) {
            self.scans.unshift({ date: +(Date.now()), content: content });
            // do whatever with scanned code
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
