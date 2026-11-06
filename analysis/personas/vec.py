import pymupdf, io
from PIL import Image, ImageDraw
import glob, os
_A = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'personas-fuente')
SRC = {'girl': glob.glob(f'{_A}/valentina/*.ai')[0], 'woman': glob.glob(f'{_A}/camila/*.ai')[0], 'boy': glob.glob(f'{_A}/andres/*.ai')[0]}
def load(n):
    d=pymupdf.open(SRC[n]); p=d[0]; return p, p.get_drawings()
def render(paths, clip, scale=4):
    W,H=clip.width,clip.height
    out=pymupdf.open(); pg=out.new_page(width=W,height=H)
    sh=pg.new_shape()
    for path in paths:
        for it in path['items']:
            o=it[0]
            mv=lambda pt: pt-clip.tl
            if o=='l': sh.draw_line(mv(it[1]),mv(it[2]))
            elif o=='re': sh.draw_rect(it[1]-clip.tl if False else pymupdf.Rect(it[1].x0-clip.x0,it[1].y0-clip.y0,it[1].x1-clip.x0,it[1].y1-clip.y0))
            elif o=='qu': q=it[1]; sh.draw_quad(pymupdf.Quad(mv(q.ul),mv(q.ur),mv(q.ll),mv(q.lr)))
            elif o=='c': sh.draw_bezier(mv(it[1]),mv(it[2]),mv(it[3]),mv(it[4]))
        lc=path.get('lineCap') or (0,)
        sh.finish(fill=path.get('fill'), color=path.get('color'), even_odd=path.get('even_odd',False), closePath=path.get('closePath',False),
                  lineJoin=path.get('lineJoin') or 0, lineCap=max(lc) if isinstance(lc,(list,tuple)) else lc, width=path.get('width') or 0,
                  stroke_opacity=path.get('stroke_opacity',1) if path.get('stroke_opacity') is not None else 1,
                  fill_opacity=path.get('fill_opacity',1) if path.get('fill_opacity') is not None else 1)
    sh.commit()
    pix=pg.get_pixmap(matrix=pymupdf.Matrix(scale,scale),alpha=True)
    return Image.open(io.BytesIO(pix.tobytes('png')))
def labels(paths, clip, scale=4, ids=None):
    im=render(paths,clip,scale).convert('RGBA'); bg=Image.new('RGBA',im.size,'white'); bg.alpha_composite(im); dr=ImageDraw.Draw(bg)
    for i,pth in enumerate(paths):
        if ids and pth['seqno'] not in ids: continue
        r=pth['rect']; x0,y0,x1,y1=[(v-o)*scale for v,o in zip((r.x0,r.y0,r.x1,r.y1),(clip.x0,clip.y0,clip.x0,clip.y0))]
        dr.rectangle([x0,y0,x1,y1],outline='red'); dr.text((x0+2,y0+2),str(pth['seqno']),fill='red')
    return bg
