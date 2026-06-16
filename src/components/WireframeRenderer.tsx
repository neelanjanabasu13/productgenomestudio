import { motion } from "framer-motion";
import type { ReactNode } from "react";

const Bar = ({ w = "100%", h = 8, op = 1, className = "" }: { w?: string | number; h?: number; op?: number; className?: string }) => (
  <div
    className={`rounded-full bg-foreground/70 ${className}`}
    style={{ width: w, height: h, opacity: op }}
  />
);

const Tile = ({ children, className = "" }: { children?: ReactNode; className?: string }) => (
  <div className={`rounded-xl bg-muted border border-border/60 ${className}`}>{children}</div>
);

const Chip = ({ children, accent = false }: { children?: ReactNode; accent?: boolean }) => (
  <div
    className={`px-2 py-1 rounded-full text-[9px] font-medium ${
      accent
        ? "bg-primary text-primary-foreground"
        : "bg-foreground/10 text-foreground/70"
    }`}
  >
    {children}
  </div>
);

function Frame({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 h-full p-4 text-foreground">{children}</div>;
}

function StatusBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between text-[10px] text-foreground/60">
      <span>9:41</span>
      <span className="font-medium tracking-wide">{title}</span>
      <span>●●●</span>
    </div>
  );
}

const screens: Record<string, (title: string) => ReactNode> = {
  photoGrid: (t) => (
    <Frame>
      <StatusBar title={t} />
      <Bar w="60%" h={14} />
      <div className="grid grid-cols-2 gap-2 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <Tile key={i} className="aspect-[3/4] flex flex-col justify-between p-2">
            <div className="self-end w-5 h-5 rounded-full bg-background/80 grid place-items-center text-[10px]">♡</div>
            <div className="space-y-1">
              <Bar w="60%" h={6} />
              <Bar w="40%" h={6} op={0.6} />
            </div>
          </Tile>
        ))}
      </div>
    </Frame>
  ),
  dealList: (t) => (
    <Frame>
      <StatusBar title={t} />
      <Bar w="50%" h={14} />
      <div className="space-y-2 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl border border-border/60">
            <Tile className="w-10 h-10" />
            <div className="flex-1 space-y-1">
              <Bar w="70%" h={6} />
              <Bar w="40%" h={5} op={0.5} />
            </div>
            <Chip accent>-{20 + i * 5}%</Chip>
          </div>
        ))}
      </div>
    </Frame>
  ),
  searchBox: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="flex-1 flex flex-col justify-center items-center gap-3">
        <Bar w="50%" h={14} />
        <Tile className="w-full h-10 flex items-center px-3"><Bar w="40%" h={6} op={0.5} /></Tile>
        <Tile className="w-full h-10 flex items-center px-3"><Bar w="30%" h={6} op={0.5} /></Tile>
        <div className="w-full h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px] font-medium">Search</div>
      </div>
    </Frame>
  ),
  filterList: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="text-[10px] text-foreground/60">128 results</div>
      <div className="flex gap-1 flex-wrap">{["All","Near","Top","$","$$"].map(c=><Chip key={c}>{c}</Chip>)}</div>
      <div className="space-y-2 flex-1">
        {[0,1,2,3].map(i=>(
          <div key={i} className="flex gap-2 p-2 border border-border/60 rounded-xl">
            <Tile className="w-12 h-12" />
            <div className="flex-1 space-y-1 pt-1">
              <Bar w="60%" h={6}/>
              <Bar w="40%" h={5} op={0.5}/>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  mapView: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="relative flex-1 rounded-xl bg-accent/40 overflow-hidden">
        {[...Array(8)].map((_,i)=>(
          <div key={i} className="absolute w-3 h-3 rounded-full bg-primary border-2 border-background"
               style={{left:`${15+i*9}%`, top:`${20+(i%4)*15}%`}}/>
        ))}
      </div>
      <Tile className="p-2 flex gap-2">
        <Tile className="w-10 h-10" />
        <div className="flex-1 space-y-1 pt-1"><Bar w="60%" h={6}/><Bar w="40%" h={5} op={0.5}/></div>
      </Tile>
    </Frame>
  ),
  listRows: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="space-y-2 flex-1">
        {[0,1,2,3,4].map(i=>(
          <div key={i} className="flex gap-3 items-center">
            <Tile className="w-9 h-9 rounded-lg"/>
            <div className="flex-1 space-y-1"><Bar w="70%" h={6}/><Bar w="40%" h={5} op={0.5}/></div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  scoreBadge: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="flex flex-col items-center gap-2 pt-4">
        <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground grid place-items-center text-2xl font-display">9.4</div>
        <Bar w="40%" h={8}/>
        <div className="text-[10px] text-foreground/60">2,184 reviews</div>
        <Chip accent>Only 2 left</Chip>
      </div>
      <div className="mt-auto h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px]">Reserve</div>
    </Frame>
  ),
  profileTrust: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-muted border border-border"/>
        <div className="flex-1 space-y-1"><Bar w="60%" h={7}/><Chip>Verified</Chip></div>
      </div>
      {[5,4,3].map(n=>(
        <div key={n} className="flex items-center gap-2">
          <span className="text-[10px] w-3">{n}</span>
          <div className="flex-1 h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{width:`${n*18}%`}}/>
          </div>
        </div>
      ))}
    </Frame>
  ),
  badgeRow: (t) => (
    <Frame>
      <StatusBar title={t} />
      <div className="flex gap-2 flex-wrap pt-2">{["Verified","Insured","24/7","Refund"].map(c=><Chip key={c} accent>{c}</Chip>)}</div>
      <Bar w="80%" h={8}/><Bar w="65%" h={6} op={0.6}/>
    </Frame>
  ),
  guestForm: (t) => (
    <Frame>
      <StatusBar title={t} />
      <Bar w="50%" h={12}/>
      {[0,1,2].map(i=><Tile key={i} className="h-9"/>)}
      <div className="text-[10px] p-2 rounded-lg bg-accent/50 text-accent-foreground">No account required</div>
      <div className="mt-auto h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px]">Continue</div>
    </Frame>
  ),
  oneClick: (t) => (
    <Frame>
      <StatusBar title={t} />
      <Tile className="p-3 flex items-center gap-2">
        <div className="w-8 h-6 rounded bg-foreground/60"/>
        <Bar w="40%" h={6}/>
      </Tile>
      <Bar w="60%" h={8}/>
      <div className="mt-auto h-12 rounded-xl bg-primary text-primary-foreground grid place-items-center text-sm font-medium">Buy now</div>
    </Frame>
  ),
  reassureForm: (t) => (
    <Frame>
      <StatusBar title={t} />
      <Bar w="55%" h={12}/>
      <div className="text-[10px] p-2 rounded-lg bg-accent/50">You won't be charged yet.</div>
      {[0,1].map(i=><Tile key={i} className="h-9"/>)}
      <div className="mt-auto h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px]">Request</div>
    </Frame>
  ),
  stampCard: (t) => (
    <Frame>
      <StatusBar title={t} />
      <Bar w="55%" h={12}/>
      <div className="grid grid-cols-5 gap-2 pt-2">
        {[...Array(10)].map((_,i)=>(
          <div key={i} className={`aspect-square rounded-full border-2 ${i<6?"bg-primary border-primary":"border-border"}`}/>
        ))}
      </div>
      <Bar w="40%" h={6} op={0.6}/>
    </Frame>
  ),
  savedGrid: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Bar w="40%" h={12}/>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {[0,1,2,3].map(i=>(
          <Tile key={i} className="aspect-square flex items-start justify-end p-2">♥</Tile>
        ))}
      </div>
    </Frame>
  ),
  tierList: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Chip accent>GOLD TIER</Chip>
      <div className="space-y-2">
        {["Free upgrades","Early access","Member pricing","Concierge"].map(c=>(
          <div key={c} className="flex items-center gap-2 p-2 rounded-lg border border-border/60">
            <div className="w-2 h-2 rounded-full bg-primary"/>
            <Bar w="60%" h={6}/>
          </div>
        ))}
      </div>
    </Frame>
  ),
  feedFull: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <div className="flex-1 flex">
        <Tile className="flex-1 relative overflow-hidden">
          <div className="absolute bottom-2 left-2 right-10 space-y-1">
            <Bar w="50%" h={8}/><Bar w="80%" h={6} op={0.7}/>
          </div>
        </Tile>
        <div className="flex flex-col gap-3 items-center justify-end ml-2 pb-4">
          {["♥","💬","↗","⋯"].map(i=><div key={i} className="w-8 h-8 rounded-full bg-foreground/10 grid place-items-center text-xs">{i}</div>)}
        </div>
      </div>
    </Frame>
  ),
  composer: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Tile className="flex-1 grid place-items-center text-foreground/50 text-xs">Tap to capture</Tile>
      <div className="flex justify-around">{["✨","🎵","📍","🏷"].map(i=><div key={i} className="w-9 h-9 rounded-full bg-muted grid place-items-center text-sm">{i}</div>)}</div>
    </Frame>
  ),
  chatThread: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <div className="flex-1 space-y-2 overflow-hidden">
        {[{me:false,w:"70%"},{me:true,w:"55%"},{me:false,w:"50%"},{me:true,w:"75%"}].map((m,i)=>(
          <div key={i} className={`flex ${m.me?"justify-end":"justify-start"}`}>
            <div className={`px-3 py-2 rounded-2xl ${m.me?"bg-primary text-primary-foreground":"bg-muted"}`} style={{width:m.w}}>
              <Bar w="80%" h={5} op={m.me?0.9:0.6}/>
            </div>
          </div>
        ))}
      </div>
      <Tile className="h-9 flex items-center px-3"><Bar w="40%" h={5} op={0.5}/></Tile>
    </Frame>
  ),
  dashboard: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Tile className="p-4">
        <div className="text-[10px] text-foreground/60">Balance</div>
        <div className="text-2xl font-display mt-1">$12,480</div>
      </Tile>
      <div className="grid grid-cols-3 gap-2">
        {["Send","Pay","Top up"].map(c=>(
          <Tile key={c} className="aspect-square grid place-items-center text-[10px]">{c}</Tile>
        ))}
      </div>
      <div className="space-y-2">
        {[0,1].map(i=>(
          <div key={i} className="flex items-center gap-2">
            <Tile className="w-8 h-8"/>
            <div className="flex-1 space-y-1"><Bar w="60%" h={5}/><Bar w="30%" h={4} op={0.5}/></div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  carousel: (t) => (
    <Frame>
      <StatusBar title={t}/>
      {[0,1].map(row=>(
        <div key={row}>
          <Bar w="35%" h={7} className="mb-2"/>
          <div className="flex gap-2 overflow-hidden">
            {[0,1,2,3].map(i=><Tile key={i} className="w-16 h-24 shrink-0"/>)}
          </div>
        </div>
      ))}
    </Frame>
  ),
  onboardChecklist: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Bar w="55%" h={12}/>
      <div className="space-y-2">
        {[true,true,false,false].map((done,i)=>(
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border/60">
            <div className={`w-4 h-4 rounded-full border-2 ${done?"bg-primary border-primary":"border-border"}`}/>
            <Bar w="55%" h={6} op={done?0.5:1}/>
          </div>
        ))}
      </div>
    </Frame>
  ),
  insightsCards: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <div className="grid grid-cols-2 gap-2">
        {[0,1,2,3].map(i=>(
          <Tile key={i} className="p-2">
            <Bar w="40%" h={5} op={0.5}/>
            <div className="text-base font-display mt-1">${(i+1)*128}</div>
            <div className="h-6 mt-1 bg-primary/30 rounded"/>
          </Tile>
        ))}
      </div>
    </Frame>
  ),
  playerView: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Tile className="aspect-square grid place-items-center text-3xl">▶</Tile>
      <Bar w="70%" h={8}/>
      <Bar w="40%" h={5} op={0.5}/>
      <div className="h-1 bg-muted rounded-full"><div className="h-full w-1/3 bg-primary rounded-full"/></div>
      <div className="flex justify-around mt-2 text-xl">⏮ ⏯ ⏭</div>
    </Frame>
  ),
  lessonCard: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Tile className="aspect-[16/10] grid place-items-center text-xs text-foreground/50">Lesson video</Tile>
      <Bar w="70%" h={10}/>
      <Bar w="90%" h={5} op={0.5}/>
      <div className="mt-auto h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px]">Continue</div>
    </Frame>
  ),
  progressRings: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <div className="flex gap-4 justify-center pt-2">
        {[70,40,90].map((p,i)=>(
          <div key={i} className="relative w-16 h-16 rounded-full"
               style={{background:`conic-gradient(var(--primary) ${p*3.6}deg, var(--muted) 0)`}}>
            <div className="absolute inset-1.5 rounded-full bg-card grid place-items-center text-[11px] font-medium">{p}%</div>
          </div>
        ))}
      </div>
      <div className="space-y-2 mt-2">
        {[0,1,2].map(i=><Bar key={i} w={`${80-i*15}%`} h={6}/>)}
      </div>
    </Frame>
  ),
  kanban: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <div className="grid grid-cols-3 gap-2 flex-1">
        {["Todo","Doing","Done"].map(col=>(
          <div key={col} className="space-y-1">
            <div className="text-[9px] text-foreground/60">{col}</div>
            {[0,1].map(i=><Tile key={i} className="h-12 p-1"><Bar w="80%" h={4}/></Tile>)}
          </div>
        ))}
      </div>
    </Frame>
  ),
  templateGallery: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {[0,1,2,3].map(i=>(
          <Tile key={i} className="aspect-[3/4] p-2 flex flex-col justify-end">
            <Bar w="60%" h={5}/>
          </Tile>
        ))}
      </div>
    </Frame>
  ),
  codeCanvas: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Tile className="flex-1 p-2 font-mono text-[9px] space-y-1">
        {["import { x } from 'y'","","function build() {","  return <Studio/>","}"].map((l,i)=>(
          <div key={i} className="text-foreground/70">{l}</div>
        ))}
      </Tile>
    </Frame>
  ),
  sendForm: (t) => (
    <Frame>
      <StatusBar title={t}/>
      <Bar w="40%" h={12}/>
      <Tile className="h-9"/>
      <Tile className="h-9"/>
      <Tile className="h-16 p-2"><Bar w="50%" h={5} op={0.5}/></Tile>
      <div className="mt-auto h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-[11px]">Send</div>
    </Frame>
  ),
};

function generic(t: string) {
  return (
    <Frame>
      <StatusBar title={t}/>
      <Bar w="55%" h={12}/>
      <div className="space-y-2 flex-1">
        {[0,1,2,3].map(i=><Tile key={i} className="h-12"/>)}
      </div>
    </Frame>
  );
}

export function WireframeRenderer({ screen, label }: { screen?: string; label?: string }) {
  const t = label ?? "";
  const node = screen && screens[screen] ? screens[screen](t) : generic(t);
  return (
    <motion.div
      key={`${screen}-${label}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      {node}
    </motion.div>
  );
}