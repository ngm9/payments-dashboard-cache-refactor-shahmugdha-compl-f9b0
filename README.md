## Task Overview

Utkrusht relies on an internal web-based payments dashboard that finance and operations teams use to track daily and monthly revenues. The current implementation makes separate requests for different summaries every time the date range changes, renders everything with raw HTML insertion, and keeps data in storage without clear rules for freshness. When network conditions are poor, users often see empty tables or outdated values without any explanation. Because these numbers are used in live review meetings, the team needs the dashboard to be fast, predictable, and structured in a way that can evolve without becoming fragile.

In this task, you will rework the existing JavaScript for the payments dashboard into a more modular and reliable design. The focus is on how data is fetched, cached, and rendered, and how errors are surfaced to the user without breaking the page. The starter code includes a basic implementation that works in a simplistic way but does not meet performance, resilience, or maintainability expectations.

## Objectives

- Provide a clear separation between data access, caching, and user interface concerns so that each part of the dashboard can evolve independently.
- Ensure payment summaries for a selected date range are loaded efficiently and reused when appropriate, instead of repeatedly fetching the same data.
- Introduce a caching approach that keeps data fresh for a limited time and can be safely used when network calls fail.
- Make the dashboard update the screen in a way that avoids unnecessary layout work and keeps the interface responsive while data is loading.
- Present clear, user-friendly feedback when something goes wrong, without leaving the page in a broken or confusing state.
- Structure the code so that it is readable, consistent, and easy to reason about, making it straightforward to add new metrics or views later.

## How to Verify

- Open the dashboard page and choose a date range; confirm that daily and monthly summaries appear together in a coherent view.
- Change the date range repeatedly and observe that data for recently used ranges appears quickly and without obvious delays under normal conditions.
- Simulate or observe network failures and verify that the page still shows a sensible state: either previously seen data for that range or a clear message explaining that fresh data is unavailable.
- Interact with the dashboard controls and confirm that the layout updates feel smooth, without unnecessary flicker or jumps in the content area.
- Check the browser developer tools to ensure that authentication information is handled consistently and that repeated requests for the exact same range are avoided while cached data is still valid.

## Helpful Tips

- Consider how to encapsulate access to the payments endpoints behind a small, well-defined interface that hides the details of network calls.
- Think about how to represent cached entries so that you can quickly decide whether they are safe to reuse or should be refreshed.
- Explore ways to update the visible dashboard using minimal DOM changes so that the browser does not have to re-layout the entire page on every interaction.
- Review patterns for coordinating multiple asynchronous operations and handling both success and failure paths without deeply nested logic.
- Reflect on how you would extend this design in the future to support additional summaries or filters without creating tight coupling between modules.
