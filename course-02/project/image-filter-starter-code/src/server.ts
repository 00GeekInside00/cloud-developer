import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // Implement /filterimage endpoint
  // upload and process an image from url 
  app.get("/filteredimage", async (req, res) => {

    const { image_url } = req.query;

    if (!image_url) {
      return res.status(400).send("Image url is required!");
    }

    const filtered_image_path = await filterImageFromURL(image_url)
      .then((image_path) => {
        res.status(200).sendFile(image_path, (err) => {
          if (err) {
            return res.status(500);
          }
          deleteLocalFiles([image_path])
        });

      })
      .catch((err) => {
        console.log(err);
        return res.status(404).send('Image not found!');
      });

  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("<marquee><h2>try GET <a href='/filteredimage?image_url='>/filteredimage?image_url={{}}</a></h2></marquee>")
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();