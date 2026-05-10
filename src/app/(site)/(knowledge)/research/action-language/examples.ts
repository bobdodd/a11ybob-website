/* Canonical XML source for each Action Language worked example.
 * Held as plain string constants so the server-rendered page can
 * pass them down as props to the client-rendered ALPlayground
 * (the engine and CodeMirror are browser-only). */

export const FIBONACCI_XML = `<seq>
  <!-- Recursive Fibonacci. Function parameters are late-bound
       constants in the function's local scope; the body is the
       single expression returned by the call. -->
  <declare-function name="fib">
    <param name="n" type="int"/>
    <if-then-else>
      <lt>
        <read-const name="n"/>
        <literal type="int" value="2"/>
      </lt>
      <read-const name="n"/>
      <add>
        <call name="fib">
          <subtract>
            <read-const name="n"/>
            <literal type="int" value="1"/>
          </subtract>
        </call>
        <call name="fib">
          <subtract>
            <read-const name="n"/>
            <literal type="int" value="2"/>
          </subtract>
        </call>
      </add>
    </if-then-else>
  </declare-function>

  <!-- Print fib(0) through fib(9). Each iteration evaluates the
       call expression and pushes the result to the output buffer.
       Try changing the upper bound; values past 20 start to slow
       noticeably (recursive fib is exponential). -->
  <print><call name="fib"><literal type="int" value="0"/></call></print>
  <print><call name="fib"><literal type="int" value="1"/></call></print>
  <print><call name="fib"><literal type="int" value="2"/></call></print>
  <print><call name="fib"><literal type="int" value="3"/></call></print>
  <print><call name="fib"><literal type="int" value="4"/></call></print>
  <print><call name="fib"><literal type="int" value="5"/></call></print>
  <print><call name="fib"><literal type="int" value="6"/></call></print>
  <print><call name="fib"><literal type="int" value="7"/></call></print>
  <print><call name="fib"><literal type="int" value="8"/></call></print>
  <print><call name="fib"><literal type="int" value="9"/></call></print>
</seq>`;
