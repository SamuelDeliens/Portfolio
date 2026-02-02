(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))d(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&d(u)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function d(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();onload=()=>{const n=setTimeout(()=>{document.body.classList.remove("not-loaded"),clearTimeout(n)},1e3);L()};function L(){const n=document.createElement("div");n.className="love-particles",document.body.appendChild(n);for(let t=0;t<20;t++)setTimeout(()=>{const o=document.createElement("div");o.className="heart",o.style.left=Math.random()*100+"vw",o.style.animationDelay=Math.random()*10+"s",o.style.fontSize=Math.random()*20+10+"px",o.style.color=["#ff4081","#ff80ab","#ff1744"][Math.floor(Math.random()*3)],n.appendChild(o),setTimeout(()=>{o.remove()},11e3)},t*500)}const i=document.getElementById("c"),e=i.getContext("webgl2");e||alert("WebGL 2 required");const T=`#version 300 es
in vec2 a;
void main(){ gl_Position=vec4(a,0,1); }`,b=`#version 300 es
precision highp float;
uniform vec3  iResolution;
uniform float iTime;
uniform vec4  iMouse;
out vec4 fragColor;

/* -----------  YOUR ORIGINAL SHADER  ------------ */
#define rad(x) radians(x)
#define np 40.
#define snp 18.
#define spawn 1
#define trail 1

vec2 N22(vec2 p){
    vec3 a = fract(p.xyx*vec3(123.34, 234.34, 345.65));
    a += dot(a, a+34.45);
    return fract(vec2(a.x*a.y, a.y*a.z));
}
float hash(vec2 uv){
    return fract(sin(dot(uv,vec2(154.45,64.548))) * 124.54); 
}

vec3 particle(vec2 st, vec2 p, float r, vec3 col){
    float d = length(st-p);
    d = smoothstep(r, r-2.0/iResolution.y, d);
    return d*col;
}
vec3 burst(vec2 st, vec2 pos, float r, vec3 col, int heart) {
    st -= pos;
    if (heart==1) st.y -= sqrt(abs(st.x))*0.1;
    r *=0.6*r;
    return (r/dot(st, st))*col*0.6;
}

vec2 get_pos(vec2 u, vec2 a, vec2 p0, float t, float ang){
    ang = rad(ang);
    vec2 d = p0 + vec2(u.x*cos(ang), u.y*sin(ang))*t + 0.5*a*t*t;
    return d;
}
vec2 get_velocity(vec2 u, vec2 a, float t, float ang){
    ang = rad(ang);
    return vec2(u.x*cos(ang), u.y*sin(ang)) + a*t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = (2.*fragCoord-iResolution.xy)/iResolution.y;
    vec3 col = vec3(0.0);
    float t = mod(iTime, 10.);
    
    float r = 0.04;
    vec2 u = vec2(5.);
    vec2 a = vec2(0.0, -9.8);
    float ang = 75.0;

    vec3 p1 = vec3(0.0);
    
    for (float i=0.; i<np; i++){
        vec2 rand = N22(vec2(i));
        vec2 ip = vec2(sin(15.*rand.x), -1.+r);
        u = vec2(sin(5.*rand.x), 5.+sin(4.*rand.y));
        float t1 = t - i/2.;
        vec2 s = get_pos(u, a, ip, t1, ang);
        vec2 v = get_velocity(u, a, t1, ang);
        float Tf = 2.0*u.y*sin(rad(ang))/abs(a.y);
        vec2 H = get_pos(u, a, ip, Tf/2.0, ang);
        vec3 pcol = vec3(sin(22.*rand.x), sin(5.*rand.y), sin(1.*rand.x));

        if (v.y<-0.5){ r=0.0; }
        p1 += burst(uv, s, r, pcol, 0);

        if (trail==1){
            for (float k=4.0; k>0.0; k--){
                vec2 strail = get_pos(u, a, ip, t1-(k*0.02), ang);
                p1 += burst(uv, strail, v.y<-0.5?0.0:r-(k*0.006), pcol, 0);
            }
        }
        
        if (v.y<=0.0 && t1>=Tf/2.0 && spawn==1){
            for (float j=0.0; j<snp; j++){
                vec2 rand2 = N22(vec2(j));
                float ang2 = (j*(360./snp));
                r = 0.035;
                r -= (t1-Tf*0.5)*0.04;
                float x = cos(rad(ang2));
                float y = sin(rad(ang2));
                y = y + abs(x) * sqrt( (8.- abs(x))/50.0 );
                vec2 heart = vec2(x*x + y*y)*(0.4/(t1*sqrt(t1)));
                vec2 S = get_pos(heart, a*0.03, H, t1-(Tf/2.), ang2);
                pcol = vec3(sin(8.*rand2.x), sin(6.*rand2.y), sin(2.*rand2.x));
                p1 += burst(uv, S, max(0.0,r), pcol, 0);
            }
        } 
    }
    
    col = p1;
    fragColor = vec4(col,1.0);
}
/* ----------------------------------------------- */

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;function g(n,t){const o=e.createShader(n);return e.shaderSource(o,t),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)||console.error(e.getShaderInfoLog(o)),o}const c=e.createProgram();e.attachShader(c,g(e.VERTEX_SHADER,T));e.attachShader(c,g(e.FRAGMENT_SHADER,b));e.linkProgram(c);e.useProgram(c);const w=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,w);e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const y=e.getAttribLocation(c,"a");e.enableVertexAttribArray(y);e.vertexAttribPointer(y,2,e.FLOAT,0,0,0);const f={res:e.getUniformLocation(c,"iResolution"),time:e.getUniformLocation(c,"iTime"),mouse:e.getUniformLocation(c,"iMouse")};i.width=window.innerWidth;i.height=window.innerHeight;e.viewport(0,0,i.width,i.height);let h=0,x=0,m=0;i.addEventListener("mousemove",n=>{h=n.clientX,x=i.height-n.clientY});i.addEventListener("mousedown",()=>m=1);i.addEventListener("mouseup",()=>m=0);let v=0;const A=60,R=1e3/A;function E(n){n-v>=R&&(v=n,e.uniform3f(f.res,i.width,i.height,1),e.uniform1f(f.time,n*.002*.3),e.uniform4f(f.mouse,h,x,m,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)),requestAnimationFrame(E)}let p=!1;const S=document.getElementById("yes-btn");S.addEventListener("mouseup",function(){p||(p=!0,setTimeout(()=>{requestAnimationFrame(E)},2e3))});document.addEventListener("DOMContentLoaded",function(){const n=document.getElementById("yes-btn"),t=document.getElementById("no-btn"),o=document.getElementById("penguin"),d=document.getElementById("question");document.getElementById("response");const r=document.querySelector(".hearts-container"),a=()=>{const l=Math.random()*(window.innerWidth-t.offsetWidth),s=Math.random()*(window.innerHeight-t.offsetHeight);t.style.position="fixed",t.style.left=`${l}px`,t.style.top=`${s}px`,t.style.transition="all 0.3s ease"};n.addEventListener("click",function(){o.classList.add("happy");const l=document.querySelector(".left-hand");l.style.animation="",d.style.opacity="0",setTimeout(()=>{d.textContent="🥰 Wowowwww 🥰",d.style.opacity="1",t.style.display="none",n.innerHTML='<i class="fas fa-heart"></i> Jeg Elsker Dig 🥺',u()},1e3)}),t.addEventListener("click",function(){a()}),t.addEventListener("mouseover",function(){a()});function u(){for(let l=0;l<20;l++)setTimeout(()=>{const s=document.createElement("div");s.className="heart",s.innerHTML="❤️",s.style.left=Math.random()*100+"vw",s.style.animationDuration=Math.random()*3+2+"s",s.style.fontSize=Math.random()*20+20+"px",s.style.opacity=Math.random()*.5+.5,r.appendChild(s),setTimeout(()=>{s.remove()},1e3)},l*100)}});
