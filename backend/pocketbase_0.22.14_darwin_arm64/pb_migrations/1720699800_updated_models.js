/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j0yx9monjjaemwa")

  // remove
  collection.schema.removeField("d2fmjtsc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kublesom",
    "name": "status",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "active",
        "complete",
        "inactive",
        "pending"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j0yx9monjjaemwa")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d2fmjtsc",
    "name": "status",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("kublesom")

  return dao.saveCollection(collection)
})
