import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import QueueService from "../services/queue-service";
import QueueStatus from "../queue_status";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import { queueIdRule, queueUpdateRules } from "../validation-rules/queue-update-rule";
import { ticketIdRule } from "../validation-rules/ticket-update-rule";
import { queueCreateRules } from "../validation-rules/queue-create-rule";
import { getAllQueuesRule } from "../validation-rules/queue-get-rule";
import { FindAllQueueAttributes } from "../respository/queue-repository";
import { queueNextTicketRule } from "../validation-rules/queue-next-ticket-rule";
import TicketService from "../services/ticket-service";
import Patient from "../models/patient";
import TicketStatus from "../ticket_status";

export const queueRoute = Router();

queueRoute.use(express.json());

queueRoute.post("/",
  validateRequest(queueCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId, doctorId } = req.body;
    const queueAttr = { clinicId, status: QueueStatus.INACTIVE, doctorId: Number(doctorId) };
    const queueInfo = await QueueService.create(queueAttr);
    res.status(StatusCodes.CREATED).json(queueInfo);
  }));

queueRoute.post("/:queueId/next-ticket",
  validateRequest(queueNextTicketRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const { doctorId } = req.body;
    const queue = await QueueService.nextTicket(doctorId, Number(id));
    res.status(StatusCodes.OK).json(queue);
  }));

queueRoute.put("/:queueId",
  validateRequest(queueUpdateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const updateAttributes = { id, ...req.body };

    const updatedQueue = await QueueService.update(updateAttributes);
    res.status(StatusCodes.OK).json(updatedQueue);
  }));

queueRoute.get("/",
  validateRequest(getAllQueuesRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId, status } = req.query;
    const findAllQueuesParams = {
      ...(clinicId && { clinicId: Number(clinicId) }),
      ...(status && { status }),
    } as FindAllQueueAttributes;

    const queues = await QueueService.fetchAllQueues(findAllQueuesParams);
    res.status(StatusCodes.OK).json(queues);
  }));

queueRoute.get("/:queueId",
  validateRequest(queueIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const queue = await QueueService.getQueueById(Number(id));
    res.status(StatusCodes.OK).json(queue);
  }));

queueRoute.get("/active/:queueId",
  validateRequest(queueIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const queue = await QueueService.getQueueById(Number(id));
    const queueString = JSON.stringify(queue);
    const jsonObj = JSON.parse(queueString);

    const ticketObjArr = [];
    const ticketIdArr = jsonObj.pendingTicketIdsOrder;
    for (let i = 0; i < ticketIdArr.length; i++) {
      const ticketObj = await TicketService.get(Number(ticketIdArr[i]), { include: [
        { model: Patient },
      ] });
      ticketObjArr.push(ticketObj);
    }
    jsonObj.pendingTicketObjsOrder = ticketObjArr;
    res.status(StatusCodes.OK).json(jsonObj);
  }));

queueRoute.put("/:queueId/remove/:ticketId",
  validateRequest(queueIdRule),
  validateRequest(ticketIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let id = Number(req.params.ticketId);
    const updateAttributes = { id, ...{ "status": TicketStatus.CLOSED } };
    await TicketService.update(updateAttributes);

    id = Number(req.params.queueId);
    const queueObj = await QueueService.getQueueById(id);
    const newOrder = queueObj.pendingTicketIdsOrder;
    newOrder.splice(newOrder.indexOf(Number(id)), 1);

    let qupdateAttributes;
    if (queueObj.currentTicketId === Number(req.params.ticketId)) {
      qupdateAttributes = { id,
        ...{ "pendingTicketIdsOrder": newOrder, "currentTicketId": null, "currentTicket": null } };
    } else {
      qupdateAttributes = { id, ...{ "pendingTicketIdsOrder": newOrder } };
    }

    const updatedQueue = await QueueService.update(qupdateAttributes);
    res.status(StatusCodes.OK).json(updatedQueue);
  }));

queueRoute.put("/:queueId/close",
  validateRequest(queueIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let id = Number(req.params.queueId);

    let findAllTicketAttributes = { "queueId": id, "status": TicketStatus.SERVING };
    const ticketObjList1 = await TicketService.findAll(findAllTicketAttributes);

    findAllTicketAttributes = { "queueId": id, "status": TicketStatus.WAITING };
    const ticketObjList2 = await TicketService.findAll(findAllTicketAttributes);

    for (let i = 0; i < ticketObjList1.length; i++) {
      const ticketObj = ticketObjList1[i];
      id = Number(ticketObj.id);
      const updateAttributes = { id, ...{ "status": TicketStatus.CLOSED } };
      await TicketService.update(updateAttributes);
    }
    for (let i = 0; i < ticketObjList2.length; i++) {
      const ticketObj = ticketObjList2[i];
      id = Number(ticketObj.id);
      const updateAttributes = { id, ...{ "status": TicketStatus.CLOSED } };
      await TicketService.update(updateAttributes);
    }

    id = Number(req.params.queueId);
    const qupdateAttributes = { id,
      ...{ "status": QueueStatus.CLOSED,
        "currentTicketId": null,
        "pendingTicketIdsOrder": [] } };

    const updatedQueue = await QueueService.update(qupdateAttributes);
    res.status(StatusCodes.OK).json(updatedQueue);
  }));