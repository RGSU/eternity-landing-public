const isClick = (event) => {
  const SPACE = 32;
  const ENTER = 13;
  if (event.type === 'click') {
    return true;
  }
  if (event.type === 'keypress') {
    const code = event.charCode || event.keyCode;
    if ((code === SPACE) || (code === ENTER)) {
      return true;
    }
  }
  return false;
};

// Clear JS

// link.addEventListener("click", handleLinkClick);
// link.addEventListener("keypress", handleLinkClick);

// function handleLinkClick(event){
//   if (isClick(event) === true) {
//     event.preventDefault();

//   };
// };

// JQuery

// $link.on("click keypress",function(event){
//     if(isClick(event) === true){
//       event.preventDefault();
//       ...
//     };
// });

export default isClick;
