<script lang="ts">
  export let form;
</script>

<form method="post" action="?/signin">
  <input name="studentID" type="text" placeholder="Student ID" />
  <input name="password" type="text" placeholder="Password" />
  <button type="submit">Submit</button>
</form>

<form method="post" action="?/getTranscript">
  <button type="submit">Get Transcript</button>
</form>

{#if form}
  <pre>{JSON.stringify(form, null, 2)}</pre>
{/if}