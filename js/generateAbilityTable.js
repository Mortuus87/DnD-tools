const mod = ["str", "dex", "con", "int", "wis", "cha"];
const ability = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

let table = `
<table class="mx-auto">
  <tbody>
    <tr>
      <th></th>
      <th>Bonus</th>
      <th>Base</th>
      <th>Cost</th>
      <th>Score</th>
      <th>Mod</th>
    </tr>`;
for (let i = 0; i < ability.length; i++) {
  table += `
    <tr class="ability-row">
      <th>
        ${ability[i]}
      </th>
      <td>
        <input type="number" class="ability-bonus form-control input-sm narrow-number-input" value="0">
      </td>
      <td>
        <input type="number" id="${mod[i]}-base" class="ability-base form-control input-sm narrow-number-input" value="7" min="7" max="18">
      </td>
      <td>
        <input type="text" readonly="readonly" class="ability-cost form-control input-sm narrow-text-input" value="0">
      </td>
      <td>
        <input type="text" id="${mod[i]}-score" readonly="readonly" class="ability-score form-control input-sm narrow-text-input" value="0">
      </td>
      <td>
        <input type="text" id="${mod[i]}-mod" readonly="readonly" class="ability-mod form-control input-sm narrow-text-input" value="0">
      </td>
    </tr>
  `;
}
table += `
  </tbody>
</table>`;

init();

function init() {
  $("#ability-table").html(table);
}