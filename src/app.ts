import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { validateHostname, validateMac } from './tools/validation';
import GlobalState from './globalState';

const app = express();
app.use(bodyParser.json());

const globalState = new GlobalState();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("<- Request ->");
  console.log(req.originalUrl);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const originalSendFunc = res.send.bind(res);
  res.send = function (body: any) {
    console.log("<- Response ->");
    console.log(body);
    return originalSendFunc(body);
  };
  next();
});

app.get("/api/getHosts", async (req: Request, res: Response) => {
  try {
    const result = await globalState.getHosts();
    res.json(result);
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});

app.get("/api/setHostname", async (req: Request, res: Response) => {
  try {
    const { mac, hostname } = req.query;

    if (!validateHostname(hostname as string) || !validateMac(mac as string)){
      return res.json({ success: false, error: "Invalid Hostname or Mac" });
    }

    const result = await globalState.setHostname(mac as string, hostname as string);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/blacklistEnable", async (req: Request, res: Response) => {
  try {
    const result = await globalState.blackListEnable();
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/blacklistDisable", async (req: Request, res: Response) => {
  try {
    const result = await globalState.blackListDisable();
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/blacklistAddHost", async (req: Request, res: Response) => {
  try {
    const { mac, hostname } = req.query;

    const result = await globalState.blacklistAddHost(mac as string, hostname as string);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/blacklistRemoveHost", async (req: Request, res: Response) => {
  try {
    const { hostId, ruleId } = req.query;

    const result = await globalState.blacklistRemoveHost(hostId as string, ruleId as string);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/getInterfaceConfiguration", async (req: Request, res: Response) => {
  try {
    const result = await globalState.getInterfaceConfiguration();
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/staticHostAdd", async (req: Request, res: Response) => {
  try {
    const { mac, ip } = req.query;

    const result = await globalState.staticHostAdd(mac as string, ip as string);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

app.get("/api/staticHostRemove", async (req: Request, res: Response) => {
  try {
    const { mac } = req.query;

    const result = await globalState.staticHostRemove(mac as string);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: (error as Error).message });
  }
});

export default app;
