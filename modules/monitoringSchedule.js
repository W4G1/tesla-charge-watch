const fs = require('fs')
var content = fs.readFileSync("./config/config.json", "utf8")
config = JSON.parse(content)

module.exports = {
    isNow() {

        this.currentHour = parseInt((new Date()).getHours())
        this.startHour = parseInt(config.monitoring_schedule.start_at)
        this.stopHour = parseInt(config.monitoring_schedule.stop_at)

        if (this.startHour > this.stopHour) {
            if (this.currentHour >= this.startHour && this.currentHour >= this.stopHour) {
                return true
            }
            else {
                return false
            }
        }
        else if (this.startHour < this.stopHour) {
            if (this.currentHour >= this.startHour && this.currentHour <= this.stopHour) {
                return true;
            }
            else {
                return false
            }
        }
        else if (this.startHour == this.currentHour && this.stopHour == this.currentHour && this.startHour == this.stopHour) {
            return true
        }
        else {
            return false
        }
    },

    isEnabled() {
        if (config.monitoring_schedule.enabled == true) {
            return true
        }
        else {
            return false
        }
    }
}