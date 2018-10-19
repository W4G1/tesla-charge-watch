
/************************************************************************/
/**                       Get modules & Configs                        **/
/************************************************************************/
/**/ const Tesla = require('tesla-api')                               /**/
/**/ const colors = require('colors')                                 /**/
/**/ const fs = require('fs')                                         /**/
/**/ require('./modules/console')                                     /**/
/**/ const Timestamp = require('./modules/timestamp')                 /**/
/**/ var monitoringSchedule = require('./modules/monitoringSchedule') /**/
/**/ var content = fs.readFileSync("./config/config.json", "utf8")    /**/
/**/ config = JSON.parse(content)                                     /**/
/************************************************************************/

async function main(_email, _password) {

  console.clear()
  console.log('-> Logging in..')

  try {
    const vehicles = await Tesla.login({ email: _email, password: _password, distanceUnit: "km" })

    var currentDateTime = new Date()
    var timestamp = new Timestamp(currentDateTime)

    console.log(colors.grey(timestamp.getTime() + ' | ') + 'Login successfull!'.green)
    console.break()

    const vehicle = vehicles[0]

    async function check() {

      var currentDateTime = new Date()
      var timestamp = new Timestamp(currentDateTime)

      if (monitoringSchedule.isNow() || monitoringSchedule.isEnabled() === false) { // Active between 23:00 & 7:00

        console.log('-> Checking..')

        var chargeState = await vehicle.chargeState()

        if (chargeState.scheduledChargingStartTime != null
          && chargeState.scheduledChargingStartTime + 600 <= Math.floor(Date.now() / 1000)
          && chargeState.chargePortDoorOpen == true
          && chargeState.connChargeCable == 'IEC'
          && chargeState.chargePortLatch == 'Engaged'
          && chargeState.batteryLevel <= 85
          && chargeState.chargeRate == 0
          && chargeState.chargeState != 'Charging') {

          var currentDateTime = new Date()
          var timestamp = new Timestamp(currentDateTime)

          console.log(colors.grey(timestamp.getTime() + ' | ') + 'Car is not charging!'.yellow)
          console.break()
          console.log('-> Attempting to restart charging..')

          /********************************************/
          /**           Send charge request          **/
          /********************************************/
          /**/ this.r = await vehicle.chargeStart() /**/
          /********************************************/

          var currentDateTime = new Date()
          var timestamp = new Timestamp(currentDateTime)

          if (this.r.result == true) {

            console.log(colors.grey(timestamp.getTime() + ' | ') + 'Success! The car should start charging again.'.green)
          }
          else {
            console.log(colors.grey(timestamp.getTime() + ' | ') + 'Error: Unable to restart charging.'.red)
          }
        }
        else {
          console.log(colors.grey(timestamp.getTime() + ' | ') + 'Everything seems fine.'.grey)
        }
      }
      else {
        console.log('-> Waiting until ' + config.monitoring_schedule.start_at + ':00..')
        console.log((timestamp.getTime() + ' | ' + (parseInt(config.monitoring_schedule.start_at) - currentDateTime.getHours()) + ' more hours to go.').grey)
      }
      console.break()
    }

    check()

    setInterval(function () {
      check()
    }, 3600000)

  } catch (err) {
    if (err.status) { // 4xx, 5xx response error
      console.log(`<${err.status} ${err.message}>`, err.response.body)
    } else { // Network failures, timeouts, and other errors
      console.error(err.stack)
    }
  }
}

main(config.email, config.password)