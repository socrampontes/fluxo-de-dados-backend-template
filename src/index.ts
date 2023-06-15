import express, { Request, Response } from "express";
import cors from "cors";
import { accounts } from "./database";
import { ACCOUNT_TYPE } from "./types";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/accounts", (req: Request, res: Response) => {
  res.send(accounts);
});

app.get("/accounts/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = accounts.find((account) => account.id === id);

    if (id && id[0] !== "a") {
      res.statusCode = 400;
      throw new Error('id invalid , id deve iniciar com a letra "a".');
    }
    if (!result) {
      res.statusCode = 404;
      throw new Error("Id not entered or not a string");
    }

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
    res.status(500).send("Erro desconhecido");
  }
});

app.delete("/accounts/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const accountIndex = accounts.findIndex((account) => account.id === id);
    if (id && id[0] !== "a") {
      res.statusCode = 400;
      throw new Error('id invalid , id deve iniciar com a letra "a".');
    }
    if (accountIndex < 0) {
      res.statusCode = 404;
      throw new Error("Id not entered or does not exist");
    }
    accounts.splice(accountIndex, 1);

    res.status(200).send("Item deletado com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.status(500).send("Erro desconhecido");
    }
  }
});

app.put("/accounts/:id", (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const newId = req.body.id
    const newOwnerName = req.body.ownerName 
    const newBalance = req.body.balance;
    const newType = req.body.type
    const account = accounts.find((account) => account.id === id);

    if(typeof newId !== "string") {
        res.statusCode = 420
        throw new Error('id invalid , id deve ser uma string')
    }

    if (newId && newId[0] !== "a") {
      res.statusCode = 405;
      throw new Error('id invalid , id deve iniciar com a letra "a".');
    }
     
    if (newId.length < 4){
      res.statusCode = 403
      throw new Error('Id deve conter no minimo 4 caracteres')
    }

    if(typeof newOwnerName !== "string"){
        res.statusCode = 411;
        throw new Error("New OwerName deve ser String")
    } 


    if (newOwnerName.length < 3) {
       
       res.statusCode = 411;
       throw new Error("Id deve ter mais de 3 caracteres");
    } 

   

    if (newBalance !== undefined) {
      if (typeof newBalance !== "number") {
        res.statusCode = 422;
        throw new Error("o valor de balance deve ser numérico");
      }
      if (newBalance < 0) {
        res.statusCode = 400;
        throw new Error("balance deve ser maior que zero");
      }
    }

    if (newType !== undefined) {
      if (
        newType !== ACCOUNT_TYPE.BLACK &&
        newType !== ACCOUNT_TYPE.GOLD &&
        newType !== ACCOUNT_TYPE.PLATINUM
      ) {
        res.statusCode = 400;
        throw new Error(
          "O 'type' precisa ser um dos seguintes valores:\nBlack\nOuro\nPlatina"
        );
      }
    }

    if (account) {
      account.id = newId || account.id;
      account.ownerName = newOwnerName || account.ownerName;
      account.type = newType || account.type;
      account.balance = newBalance || account.balance;
      //account.balance = isNaN(newBalance) ? account.balance : newBalance;
      account.balance = newBalance >= 0 ? newBalance : account.balance;
    }

    res.status(200).send("Atualização realizada com sucesso");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.status(500).send("Erro desconhecido");
    }
  }
});
