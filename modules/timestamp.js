class Timestamp {

  constructor(dateTime) {
    this.day = ('0' + dateTime.getDate()).slice(-2).toString();
    this.month = ('0' + (dateTime.getMonth() + 1)).slice(-2).toString();
    this.year = dateTime.getFullYear().toString();
    this.hour = ('0' + dateTime.getHours()).slice(-2).toString();
    this.minute = ('0' + dateTime.getMinutes()).slice(-2).toString();
  }

  getDate() {
    return (this.day + '-' + this.month + '-' + this.year + ' @ ' + this.hour + ':' + this.minute)
  }

  getTime() {
    return (this.hour + ':' + this.minute)
  }
}

module.exports = Timestamp