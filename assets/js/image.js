let isCat = true;

function changePic() {
  const img = document.getElementById('photo');
  if (isCat) {
    img.src = "assets/image/dog.jpg";
  } else {
    img.src = "assets/image/cat.jpg";
  }
  isCat = !isCat;
}