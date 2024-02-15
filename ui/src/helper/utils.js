


export const GetFormattedDate = (timestamp) => {
    // var todayTime = new Date(timestamp * 100);
    // var month = format(todayTime.getMonth() + 1);
    // var day = format(todayTime.getDate());
    // var year = format(todayTime.getFullYear());
    // return month + "/" + day + "/" + year;




    const date = new Date(1599813246456)
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
    const [{ value: month }, { value: day }, { value: year }] = dateTimeFormat.formatToParts(date)

    return `${day}-${month}-${year}`
}

export const getTimeStamp = (dateString) => {
    let date = dateString.split("-");
    var newDate = new Date(date[0], date[1] - 1, date[2]);
    let timestamp = newDate.getTime()
    return timestamp
}

export const  createAction = (action, payload, error) =>  {
    return {
      type: action,
      payload: payload,
      error: error,
    }
  }