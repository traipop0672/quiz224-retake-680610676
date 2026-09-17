import { Router, type Request, type Response } from "express";
// import Zod validators
import {
  zUserId,
  zItemId,
  zItemPostBody,
  zItemPutBody,
  zItemDeleteBody,
} from "../libs/zodValidators.js";
// import types
import type { Item } from "../libs/types.ts";
// import database
import { items } from "../db/db.ts";
//import uuid
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middlewares/authenMiddleware.ts";
import { checkRoleMiddleware } from "../middlewares/checkRoleMiddleware.ts";

const router = Router();

// GET /api/vXXX/items/:userId
router.get(
  "/:userId",
  authenticateToken,
  checkRoleMiddleware,
  (req: CustomRequest, res: Response) => {
    try {
      const userId = req.params.userId;
      const user = req.user;

      // check UserId
      const result = zUserId.safeParse(userId);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues[0]?.message,
        });
      }
      if (!user) {
        return res.status(403).json({
          ok: false,
          message: "Invalid UserName or Password",
        });
      }
      if (user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      const userItems = items.filter((item) => item.userId === userId);
      if (userItems.length == 0) {
        return res.status(404).json({
          success: false,
          messege: `items for user ID ${userId} not found`,
        });
      } else {
        return res.status(200).json({
          success: true,
          data: userItems,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something is wrong with getting items",
        error: err,
      });
    }
  },
);

// POST /api/vXXX/items/:userId, body = {new item data}
// add a new Item for userId
router.post(
  "/:userId",
  authenticateToken,
  checkRoleMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const { product_name, unit_price, quantity, category } = await req.body;
      const userId = req.params.userId;
      const user = req.user;

      // check UserId
      const result = zUserId.safeParse(userId);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues[0]?.message,
        });
      }
      if (!user) {
        return res.status(403).json({
          ok: false,
          message: "Invalid UserName or Password",
        });
      }
      if (user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access",
        });
      }

      const newItem: Item = {
        userId: userId,
        itemId: uuidv4(),
        product_name: product_name,
        unit_price: unit_price,
        quantity: quantity,
        category: category,
      };

      items.push(newItem);

      return res.status(201).json({
        success: true,
        message: "New Item has been added successfully",
        data: newItem,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something is wrong with adding item",
        error: err,
      });
    }
  },
);

// Delete /api/vXXX/items/:userId

export default router;
