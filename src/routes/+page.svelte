<script lang="ts">
  export let form;
</script>

<form method="post" action="">
  <input name="studentID" type="text" placeholder="Student ID" />
  <input name="password" type="text" placeholder="Password" />
  <button type="submit">Submit</button>
</form>

{#if form}
  <pre>
    {JSON.stringify(form, null, 2)}
  </pre>
{/if}