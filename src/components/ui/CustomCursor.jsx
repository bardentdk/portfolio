import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef     = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    const dot     = dotRef.current;
    const outline = outlineRef.current;
    if (!dot || !outline) return;

    let mx = 0, my = 0, ox = 0, oy = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    };

    const tick = () => {
      ox += (mx - ox) * 0.13;
      oy += (my - oy) * 0.13;
      outline.style.left = ox + 'px';
      outline.style.top  = oy + 'px';
      requestAnimationFrame(tick);
    };

    const enter = () => outline.classList.add('is-hovering');
    const leave = () => outline.classList.remove('is-hovering');

    const bind = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    };

    document.addEventListener('mousemove', onMove);
    bind();
    requestAnimationFrame(tick);

    const obs = new MutationObserver(bind);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => { document.removeEventListener('mousemove', onMove); obs.disconnect(); };
  }, []);

  return (
    <>
      <div ref={dotRef}     className="cursor-dot"     aria-hidden />
      <div ref={outlineRef} className="cursor-outline" aria-hidden />
    </>
  );
};

export default CustomCursor;