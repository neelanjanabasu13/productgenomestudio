Fix the synthesis walkthrough modal getting users stuck.

What I’ll change:
1. Make the modal reliably dismissible
   - Keep the X close button, but move it into a sticky, visible top-right position so it is not clipped on small screens.
   - Add a clear “Back to Studio” text button in the modal header/footer.
   - Keep Escape and backdrop-click close behavior.

2. Make the flow completable
   - Add an explicit “Complete flow” / “View concept” action so users do not have to wait for autoplay.
   - Keep Previous / Next controls usable all the way through the end card.
   - Make hover-pause resume correctly after leaving the phone area.

3. Fix mobile viewport trapping
   - Constrain the modal content to the viewport with vertical scrolling when needed.
   - Ensure controls are always reachable below the phone frame on the current ~673px-wide preview.

Technical notes:
- Update `FlowReelModal` and `EndCard` in `src/routes/studio.$industryId.tsx` only.
- Preserve the dark theme, Playfair/DM Sans/JetBrains Mono feel, teal accent, and the existing phone reel animation.