import pymupdf
def clusters(paths, pad=1.0):
    n=len(paths); par=list(range(n))
    def f(i):
        while par[i]!=i: par[i]=par[par[i]]; i=par[i]
        return i
    R=[pymupdf.Rect(p['rect']) for p in paths]
    for i in range(n):
        a=R[i]+(-pad,-pad,pad,pad)
        for j in range(i+1,n):
            if a.intersects(R[j]): par[f(i)]=f(j)
    g={}
    for i in range(n): g.setdefault(f(i),[]).append(paths[i])
    out=[]
    for v in g.values():
        r=pymupdf.Rect(v[0]['rect'])
        for p in v: r|=p['rect']
        out.append((r,v))
    return sorted(out,key=lambda x:(round(x[0].y0/40),x[0].x0))
