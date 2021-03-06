const express = require('express');
const router  = express.Router();

const { deleteMap, insertMap, fetchMapByMapID, fetchMapsByUserID, fetchMarkersByMapID, fetchMapByInterestName, deleteMarker, insertMarker, addFavourite, removeFavourite, deleteAllMarkers, updateMarker} = require('../helpers/mapHelpers.js')

const { fetchUserByID } = require('../helpers/userHelpers.js')

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      userInfo: req.session.user,
    }
    res.render("maps_by_interest", templateVars);
  });

  router.get("/new", (req, res) => {
    if(req.session.user) {
      const templateVars = {
        userInfo: req.session.user,
      }
      res.render("new_map", templateVars);
    } else {
      res.redirect('/maps')
    }

  });

  router.get("/example", (req, res) => {
    const templateVars = {
      userInfo: req.session.user,
    }
    res.render("map_template", templateVars);
  });

  // temp route to show edit_marker.ejs
  router.get("/marker", (req, res) => {

    const templateVars = {
      userInfo: req.session.user,
    }
    res.render("edit_marker", templateVars);
  });


  router.get("/search/:interestName", (req, res) => {
    fetchMapByInterestName(req.params.interestName)
      .then(output => {
        templateVars = {
          table: output.rows,
          userInfo: req.session.user
        }

        res.render("maps_show", templateVars)
      }
      )



  });

  router.get("/:mapID/points/", (req, res) => {
      return fetchMarkersByMapID(req.params.mapID)
      .then(output => {
          res.send(output.rows)
        })
    ;
  });

  router.get("/:mapID/info", (req, res) => {
    fetchMapByMapID(req.params.mapID)
    .then(output => {
      res.send(output.rows[0]);
    })
  });

  router.get("/:mapID/edit", (req, res) => {
    if(req.session.user) {
      fetchMapByMapID(req.params.mapID).then (output => {


        const templateVars = {
          userInfo: req.session.user,
          table: output.rows[0],
          map_id: req.params.mapID,
        }

        res.render("edit_map", templateVars);
      })


    } else {
      res.redirect('/maps')
    }

  });

  router.get("/:mapID", (req, res) => {
    fetchMapByMapID(req.params.mapID)
    .then(output => {
      const table = output.rows[0]
      const templateVars = {
        map_id: table.map_id,
        user_id: table.user_id,
        interest_id: table.interest_id,
        lat_start: table.lat_start,
        lng_start: table.lng_start,
        zoom: table.zoom,
        name: table.name,
        description: table.description,
        created_at: table.created_at,
        last_edited: table.last_edited,
        userInfo: req.session.user,
      }

      res.render("specific_map", templateVars);
    })
  });


  router.post("/:mapID/delete", (req, res) => {
    if(req.session.user) {
      deleteAllMarkers(req.params.mapID)
        .then(() => {
        deleteMap(req.params.mapID)
      }).then(() => {
        res.redirect('/profile')
      })
    } else {
      res.redirect('/maps')
    }
  });

  router.post("/:mapID/markers/:markerID/delete", (req, res) => {
    console.log("MARKER ID", req.params.markerID)
    deleteMarker(req.params.markerID)
    res.redirect(`/maps/${req.params.mapID}`)

  })


// use old delete marker funtion to delete marker

  // add new funtion to update marker
  router.post("/:mapID/markers/edit/:markerID", (req,res) => {
    console.log(req.body)
    details = {
      marker_id: Number(req.params.markerID),
      title: req.body.title,
      description: req.body.description,
    }
    console.log(details)
    updateMarker(details)

    res.redirect(`/maps/${req.params.mapID}`)

  })


  router.post("/:mapID/markers/", (req,res) => {
    console.log(req.body)
    details = {
      map_id: Number(req.params.mapID),
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
      title: req.body.title,
      description: req.body.description,
    }

    insertMarker(details)

    res.redirect(`/maps/${req.params.mapID}`)

  })

  router.post("/:mapID/favourites/add", (req, res) => {
    if(req.session.user) {
      const incomingMapID = req.params.mapID

      fetchUserByID(req.session.user)
        .then(output => {

          const table = output.rows[0]
          console.log("fetchUserByID", output.row)

          const details = {
            mapID: Number(incomingMapID),
            userID: Number(table.id),
            }

            addFavourite(details)
            res.redirect('/profile');
          }
        )
    } else {
      res.redirect('/auth/login')
    }

  });

  router.post("/:mapID/favourites/remove", (req, res) => {

    const details = {
    userID: req.session.user,
    mapID: req.params.mapID,
    }

    removeFavourite(details)
    res.redirect('/profile');
  });

  router.post("/new", (req, res) => {

     const details = {
        owner_id: Number(req.session.user),
        name: req.body.name,
        interest_id: Number(req.body.interest_id),
        description: req.body.description,
        lat_start: Number(req.body.lat_start),
        lng_start: Number(req.body.lng_start),
        zoom: Number(req.body.lng_start),
      }

    insertMap(details).then(() => {
      res.redirect('/profile')
    })
  });

  return router;
};

