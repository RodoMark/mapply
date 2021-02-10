const express = require('express');
const router  = express.Router();

const { fetchMapByMapID, fetchMapsByUserID, fetchMarkersByMapID, deleteMarker, insertMarker } = require('../helpers/mapHelpers.js')

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("maps_by_interest");
  });

  router.get("/new", (req, res) => {
    res.render("new_map");
  });

  router.get("/example", (req, res) => {
    res.render("map_template");
  });

  router.get("/search", (req, res) => {
    // return db.query(
    //   // Search query goes here
    //   `
    //   SELECT map_id
    //   FROM maps
    //   JOIN interests ON interests.id = interest_id
    //   WHERE interests.name = $1
    //   `
    // , [req.body.search]).then(

      res.render("maps_show")
    // )
    // ;
  });

  router.get("/:mapID/points/", (req, res) => {
      return fetchMarkersByMapID(req.params.mapID)
      .then(output => {
          res.send(output.rows)
        })
    ;
  });

  router.get("/editmap", (req, res) => {
    res.render("edit_map");

  router.get("/:mapID", (req, res) => {
    fetchMapByMapID(req.params.mapID)
    .then(output => {
      const table = output.rows[0]
      const templateVars = {
        map_id: table.id,
        owner_id: table.owner_id,
        interest_id: table.interest_id,
        name: table.name,
        description: table.description,
        created_at: table.created_at,
        last_edited: table.last_edited
      }

      console.log("----TEMPLATE VARS----", templateVars)

      res.render("maps_show", templateVars);
    })
  });

  // router.get("/:id", (req, res) => {
  //   res.render("map_show");
  // });

  router.get("/specific", (req, res) => {
    res.render("specific_map");
  })

  router.post("/:id", (req, res) => {

  });

  router.post("/:mapID/markers/:markerID/delete", (req, res) => {
    console.log("MARKER ID", req.params.markerID)
    deleteMarker(req.params.markerID)
    res.redirect("/maps/example")
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

    insertMarker(details).then(() => {
      res.redirect('/maps/example')
    }
    )
  })

  router.put("/new", (req, res) => {
    db.query(
      details = {
        owner_id: req.session.id,
        interest_id: req.params.interest_id,
        name: req.params.name,
        name: req.params.description,
      }

    )
  });

  return router;
});
}
