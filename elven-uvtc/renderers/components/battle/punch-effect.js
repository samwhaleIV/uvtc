function GetPunchImpactEffect() {
    return {
        startTime: performance.now(),
        size: 20 + Math.random() * 20,
        angleOffset: PI2 * Math.random(),
        rotationPolarity: Math.randomPolarity(),
        xOffset: (Math.random() * 50) - 25,
        yOffset: (Math.random() * 20) - 10,
        render: function(timestamp) {
            const delta = Math.min(100,timestamp-this.startTime) / 100;
            const size = this.size * delta;
            const halfSize = size / 2;
            context.save();
            context.translate(halfWidth+this.xOffset,halfHeight+this.yOffset);
            context.rotate(PI2*delta*this.rotationPolarity+this.angleOffset);
            context.fillStyle = "rgba(255,0,0,0.82)";
            context.fillRect(-halfSize,-halfSize,size,size);
            context.restore();
            if(delta === 1) {
                this.terminate();
            }
        }
    }
}
export default GetPunchImpactEffect;
