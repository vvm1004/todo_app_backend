export function getDate (){
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    }

    return today.toLocaleDateString("en-us", options);;
}

export function getDay (){
    const today = new Date();

    const options = {
        weekday: "long",
    }

    return today.toLocaleDateString("en-us", options);

}

