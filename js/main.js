var joinApp = angular.module('joinApp', ['ngSanitize']);



function JoinsCtrl($scope) {


  $scope.users = [
    { id: 1, name: 'Patrik' },
    { id: 2, name: 'Albert' },
    { id: 3, name: 'Maria' },
    { id: 4, name: 'Darwin' },
    { id: 5, name: 'Elizabeth' }
  ];

  $scope.likes = [
    { user_id: 3, like: 'Stars' },
    { user_id: 1, like: 'Climbing' },
    { user_id: 1, like: 'Code' },
    { user_id: 6, like: 'Rugby' },
    { user_id: 4, like: 'Apples' }
  ];

  $scope.sql = {
    show_desc: false,
    toggle_desc: function(){
      $scope.sql.show_desc = $scope.sql.show_desc ? false : true;
    },
    inner: {
      query: "  SELECT Users.name,"+
        "  <br>Likes.like"+
        "  <br>FROM Users"+
        "  <br>JOIN Likes"+
        "  <br>ON users.id=likes.user_id;",
      desc: "INNER JOIN or just JOIN retrieves all users and likes that match each other ( where the id field in users matches a user_id in the likes table and vice versa )"
    },
    left: {
      query: "  SELECT Users.name,"+
        "  <br>Likes.like"+
        "  <br>FROM Users"+
        "  <br>LEFT JOIN Likes"+
        "  <br>ON users.id=likes.user_id;",
      desc: "LEFT JOIN retrieves all users and its likes if there is any else sets NULL in the like field"
    },
    right: {
      query: "  SELECT Users.name,"+
        "  <br>Likes.like"+
        "  <br>FROM Users"+
        "  <br>RIGHT JOIN Likes"+
        "  <br>ON users.id=likes.user_id;",
      desc: "RIGHT JOIN is like LEFT JOIN but retrieves all likes with all matching users or NULL if it doesn't have any matching user"
    },
    outer: {
      query: "  SELECT Users.name,"+
        "  <br>Likes.like"+
        "  <br>FROM Users"+
        "  <br>FULL JOIN Likes"+
        "  <br>ON users.id=likes.user_id;",
      desc: "FULL JOIN retrieves all users and likes, even if a column from one or both tables is NULL (empty)."
    }
  };

  $scope.joins = [];
  $scope.user_ids = [];
  $scope.current_join = 'inner';
  $scope.type = false;

  $scope.isNotSelected = function(id){
    if($scope.user_ids.indexOf(id) === -1){
      return 'is-not-selected';
    }
  }

  $scope.currentJoinClass = function(join){
    if($scope.current_join == join){
      return 'current-join';
    }
  }


  $scope.selectJoin = function(join){
    $scope.current_join = join;
    $scope[join +'Join']();
  };

  $scope.removeItem = function(type, index){
    $scope[type].splice(index, 1);
    $scope.selectJoin($scope.current_join);
  };


  $scope.addModal = function(type){
    $scope.type = type;
    var id = 1;

    $scope.modalType = 'add';

    // auto-increment user id as default on add and show lates
    $scope.users.forEach(function(user){
      if(id < user.id) id = user.id;
    });
    if(type == 'users'){
      id++;
    }
    $scope.addId = id;

    // Focus on the id field
    setTimeout(function(){
      var add = document.getElementById('addId');
      add.focus();
    }, 100)

  }

  $scope.addItem = function(){

    // add the item to the array
    if($scope.type == 'users'){
      $scope[$scope.type].push({ id: $scope.addId, name: $scope.addName });
    }else{
      $scope[$scope.type].push({ user_id: $scope.addId, like: $scope.addName });
    }

    // Clear the data
    $scope.addName = '';
    $scope.addId = '';

    // recreate the join table
    $scope.selectJoin($scope.current_join);

    // Close the modal
    $scope.modalType = false;
  };


  // SELECT users.name, likes.like FROM users JOIN likes ON users.id = likes.user_id;
  $scope.innerJoin = function(){

    var result = [];
    $scope.user_ids = [];

    // Loop through all likes and users to find matches
    angular.forEach($scope.likes, function(like){ // value, key
      angular.forEach($scope.users, function(user){
        if(user.id == like.user_id){
          result.push({ name: user.name, like: like.like });
          $scope.user_ids.push(user.id);
        }
      });
    });
    $scope.joins = result;
  };

  // Default
  $scope.innerJoin();


  // SELECT users.name, likes.like FROM users LEFT JOIN likes ON users.id = likes.user_id;
  $scope.leftJoin = function(){

    var result = [];
    $scope.user_ids = [];

    // Loop through all likes and users to find matches
    angular.forEach($scope.users, function(user){ // value, key
      var hasLike = false;
      $scope.user_ids.push(user.id);
      angular.forEach($scope.likes, function(like){
        if(user.id == like.user_id){
          result.push({ name: user.name, like: like.like });
          hasLike = true;
        }
      });
      if(!hasLike){
        result.push({ name: user.name, like: 'NULL' });
      }
    });
    $scope.joins = result;
  };


  // SELECT users.name, likes.like FROM users RIGHT JOIN likes ON users.id = likes.user_id;
  $scope.rightJoin = function(){

    var result = [];
    $scope.user_ids = [];

    // Loop through all likes and users to find matches
    angular.forEach($scope.likes, function(like){ // value, key
      var hasLike = false;
      $scope.user_ids.push(like.user_id);
      angular.forEach($scope.users, function(user){
        if(user.id == like.user_id){
          result.push({ name: user.name, like: like.like });
          hasLike = true;
        }
      });
      if(!hasLike){
        result.push({ name: 'NULL', like: like.like });
      }
    });
    $scope.joins = result;
  };

  // SELECT Users.name, Likes.like
  // FROM Users 
  // FULL JOIN Likes
  // ON users.id=likes.user_id
  $scope.outerJoin = function(){

    var result = [];
    $scope.user_ids = [];

    // Loop through all likes and users to find matches
    angular.forEach($scope.users, function(user){ // value, key
      var hasLike = false;
      $scope.user_ids.push(user.id);
      angular.forEach($scope.likes, function(like){
        if(user.id == like.user_id){
          result.push({ name: user.name, like: like.like });
          hasLike = true;
        }
      });
      if(!hasLike){
        result.push({ name: user.name, like: 'NULL' });
      }
    });

    // Loop through all likes and users to find matches
    angular.forEach($scope.likes, function(like){ // value, key
      if($scope.user_ids.indexOf(like.user_id) === -1){
        result.push({ name: 'NULL', like: like.like });
        $scope.user_ids.push(like.user_id);
      }
    });

    $scope.joins = result;
  };

}


// Shared setup
var height = 150;
var width = 225;
var overlap = 40;
var radius = 60;

var cx1 = width / 2 - overlap / 2;
var cx2 = width / 2 + overlap / 2;
var cy = height / 2;

var svgAttr = {
  viewBox: "0 0 " + width + " " + height,
  width: "100%",
  height: "auto",
  preserveAspectRatio: "xMidYMid meet"
};

// INNER JOIN
var inner = Snap("#inner").attr(svgAttr);
var c1 = inner.circle(cx1, cy, radius).attr({
  fill: "#cecef9",
  stroke: "#00c8c6",
  strokeWidth: 3
});
var c2 = inner.circle(cx2, cy, radius).attr({
  fill: "#fff"
});
c1.attr({
  mask: c2
});

// LEFT JOIN
var left = Snap("#left").attr(svgAttr);
var c1 = left.circle(cx1, cy, radius).attr({
  fill: "#cecef9",
  stroke: "#00c8c6",
  strokeWidth: 3
});
var c2 = left.circle(cx2, cy, radius).attr({
  fill: "none",
  stroke: "#ffbf00",
  strokeWidth: 3
});

// RIGHT JOIN
var right = Snap("#right").attr(svgAttr);
var c1 = right.circle(cx1, cy, radius).attr({
  fill: "none",
  stroke: "#00c8c6",
  strokeWidth: 3
});
var c2 = right.circle(cx2, cy, radius).attr({
  fill: "#cecef9",
  stroke: "#ffbf00",
  strokeWidth: 3
});

// OUTER JOIN
var outer = Snap("#outer").attr(svgAttr);
var c1 = outer.circle(cx1, cy, radius).attr({
  fill: "#cecef9",
  stroke: "#00c8c6",
  strokeWidth: 3
});
var c2 = outer.circle(cx2, cy, radius).attr({
  fill: "#cecef9",
  stroke: "#ffbf00",
  strokeWidth: 3
});





// inner
var inner = svgs.inner.main;
// Generate a new circle and one mask part of it
var cc1_inner = inner.circle(center,center,radius);
cc1_inner.attr({
    fill: fillColor
});
var cc2_inner = inner.circle(center2,center,radius);
cc2_inner.attr({
  fill: "#fff"
});
cc1_inner.attr({
  mask: cc2_inner
});


// Outer
var outer = svgs.outer.main;
// Create another circle to generate the crossing strokes
var cc1 = outer.circle(center,center,radius);
cc1.attr({
    fill: "none",
    stroke: "#00c8c6",
    strokeWidth: strokeWidth
});
