import express from "express";
import path from "path";
import { generateCard} from '../controller/cardPayController.js';

const router = express.Router();

/*router.post("/pay", pay);

router.post('/card-token', generateCardToken);

router.post('/card', generateCardTokenAndPay);

*/
//assas 
router.post('/cards', generateCard);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'pagador.html'));
});

export default router;
