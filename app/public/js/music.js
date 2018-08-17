// eslint-disable;
"use strict";

// varibles for identifying the song currently playing
let songIndex = 0;
let currentSong;

// timer variables
const maxtime = 30;
let time = maxtime;
let timerID;

// score tracking variables
let score = 0;
let totalScore = 0;

let songs = [];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
};

const getSongs = (playListName) => {
  //Ajax call for /songs path using get method, server responds with song data
  $.ajax({
    url: "/songs/" + playListName,
    method: "GET"
  })
  .done(data => {
    songs = data;
    console.log(songs);
    shuffleArray(songs);
  });
};

//function for playing music and updating screen info on for new song
const playMusic = () => {
  score = 0;
  $("#scoreText").text(score);
  console.log("play button clicked");

  currentSong = songs[songIndex];

  $("#playAudio").attr({  //adding song playing information to audio element
    'src': currentSong.previewUrl,
    'volume': 0.5,
    'autoplay': 'autoplay',
    'class': 'playingMusic'
    });

    $("#playButton").prop("disabled", true);
    $("#playButton").css({"background-color":"#e6e6e6","cursor":"default"});

    time = maxtime;

    //displays time in html
    $("#timer").text(time);
    timerID = setInterval(countDown, 1000);

    // Add hints per song
    $("#albumHintText").html('Album:<br>' + currentSong.albumName);
    $("#yearHintText").html('Year:<br>' + currentSong.year.substring(0,4));
    console.log("album " + currentSong.albumName);
};

// function to aggregate operations to be done when a song stops playing
const stopMusic = () => {

  //stops timer (interval set at play button click)
  clearInterval(timerID);

  //stops audio
  let audio = $("#playAudio")[0];
  audio.pause();

  //increments index of song array to play next song
  songIndex++;
  if (songIndex === songs.length) {
    songIndex=0;
  }

  console.log("this is the song index number: " + songIndex);

  // activates play button again, returns color to normal
    $("#playButton").prop("disabled", false);
    $("#playButton").css({"background-color":"#FBF59B", "cursor":"pointer"});

};

// function for managing timer countdown and effects
const countDown = () => {

  //decrements time
  time--;

  //displays time in html
  $("#timer").text(time);
  // $("#timer").css({"color":"#FF8C69"});

  if (time === 0) {
    stopMusic();
    $("#statusMessage").text("Time's Up! Guess again!");
  }
};

// All JQuery calls often need to be made within a document ready function.

// Page must be loaded before top level functions will occur. On click won't go unless DOM/document of page is ready.

$(document).ready(function() {
  
  // player name show
  $("#nameButton").on("click", function(event) {
    
    const playerName1 = $("#playerName").val();
    console.log(playerName1);
    $("#player").text(playerName1);
    
  });

  $("#game").hide();
  //choose pop quiz button
  $("#popQuiz").on("click", function(event) {
    $("#home").hide();
    $("#game").show();
    getSongs("pop");
  });

  //choose indie quiz button
  $("#indieQuiz").on("click", function(event) {
    $("#home").hide();
    $("#game").show();
    getSongs("indie");
  });

  //Placing initial values in display areas
  $("#timer").text(time);
  $("#timer").css({"color":"#FF8C69"});
  $("#scoreText").text(score);
  $("#totalScoreText").text(totalScore);

 
  $("#playButton").on("click", function(event) {
    $("#statusMessage").text("");
    playMusic();
      // attemps at adding an x over play button via DIV
      // $("#playStart").append(`<div id="xOutPlay">
      //    <span id="x">X</span></div>`)
      //    .css({"font-size":"200%" });;
  });

  // actions when skip button is clicked
  $("#skipButton").on("click", function(event) {
    //check if playButton is not enabled
    if ($('#playButton').prop("disabled") === true) {
      stopMusic();
      playMusic();
      }

  });

  // actions when guess button is clicked
  $("#guessButton").on("click", function(event) {

    let guess = $("#guessInput").val().toLowerCase().trim();
    if (guess === "") {
      return;
    }
    console.log("This is guess input from form: " + guess);
    currentSong = songs[songIndex];

    if (guess === currentSong.songTitle.toLowerCase()) {
      stopMusic();
      $("#statusMessage").text("You guessed the right song!");
      //alert("You guessed the right song!");

      //Tracking score

      score = time * 10;
      $("#scoreText").text(score);
      console.log(score);

      totalScore += score;
      $("#totalScoreText").text(totalScore);
    }
    else {
      $("#statusMessage").text("Keep Guessing!");
      //alert("Keep guessing");
    }

    // let playerName1 = $("#playerName").val();
    // $("#player").text(playerName1);
    //switch case or if statements for total score

    let guess2 = $("#guess1").text();
    let guess3 = $("#guess2").text();

    $("#guess1").text(guess);
    $("#guess2").text(guess2);
    $("#guess3").text(guess3);

    //clear form
    $("#guessInput").val("");
  });
}); //end document ready



//older code

//array of songs to be played

//   {
//   artist: "Blondie",
//   title:"Dead Air",
//   url:"./audio/01 - Dead Air.mp3",
//   },
//   {
//   artist: "She and Him",
//   title:"Never Wanted Your Love",
//   url:"./audio/05 - Never Wanted Your Love.mp3",
//   },
//   {
//   artist: "Nicholas York",
//   title:"Clair De Lune",
//   url:"./audio/03 - Ave Maria.mp3",
//   },
// ];
