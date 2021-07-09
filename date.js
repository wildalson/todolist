// function getDate()
// {
//     let today = new Date();
//     let options = {
//         weekday: "long",
//         year: "numeric", 
//         month: "long"
//     };
//     let day = today.toLocaleDateString("en-US", options);
//     return day;
// }

// function getDay()
// {
//     let today = new Date();
//     let options = {
//         weekday: "long",
//     };
//     let day = today.toLocaleDateString("en-US", options);
//     return day;
// }


// module.exports.getDate = getDate;
// module.exports.getDay = getDay;

// console.log(module.exports);


exports.getDate = function()
{
    let today = new Date();
    let options = {
        weekday: "long",
        year: "numeric", 
        month: "long"
    };
    return  today.toLocaleDateString("en-US", options);
}
exports.getDay = function()
{
    let today = new Date();
    let options = {
        weekday: "long",
        year: "numeric", 
        month: "long"
    };
    return today.toLocaleDateString("en-US", options);
}