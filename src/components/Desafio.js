import React, {Component} from 'react';

import axios from 'axios';
import sha1 from 'js-sha1';

class Desafio extends  Component{

	state = {
		numero_casas: "",
		token: "",
		cifrado: "",
		decifrado: "",
		resumo_criptografico: "",
		file: "",
		anexo: false
	}

	componentDidMount(){
		axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=SEU_TOKEN')
		.then( response => {

			if(response){
				const resul = this.ConsomeAPI(response.data.numero_casas,response.data.token,response.data.cifrado,response.data.decifrado,response.data.resumo_criptografico);
				this.handleInputChange(response.data.cifrado);
				this.download(true);
			}else{
				this.download(false);
			}			
		}
			
		);

		
		
	}

	ConsomeAPI = (arg1, arg2, arg3, arg4, arg5) => {
		this.setState({
				numero_casas: arg1, 
				token: arg2, 
				cifrado: arg3,
				decifrado: arg4,
				resumo_criptografico: arg5
			});



	}
	Criptografia = (nome, numero_casas=this.state.numero_casas) => {

		let totalCaracteres = nome.toLowerCase().toString();

		let saida = '';

		for (var i = 0; i < totalCaracteres.length; i++) {
			
			let c = (totalCaracteres.charCodeAt(i));
			let caractere = '';
			let aux = '';

			if(c>=97 && c<=122){
				aux = (c-numero_casas);

				if(aux>122){
					aux -= 26;
					caractere = String.fromCharCode(aux);
				}else if(aux<97){
					aux += 26;
					caractere = String.fromCharCode(aux);
				}else{
					caractere = String.fromCharCode(aux);
				}

			}else if(c===32){
				caractere = ' ';
			}else if(c===46){
				caractere = '.';
			}
			else{
				caractere = String.fromCharCode(c);
			}

			saida+= caractere;

		}

		return saida;

	}


	handleInputChange = (value) => {
		this.setState(
					{ 
						decifrado: this.Criptografia(value)
					}
			); 
	}

	download = (e) => {
		//e.preventDefault();

		const valores = {
			numero_casas: this.state.numero_casas,
			token: this.state.token,
			cifrado: this.state.cifrado,
			decifrado: this.state.decifrado,
			resumo_criptografico: sha1(this.state.decifrado)
		}

		if(e==true){
			alert("Seu arquivo está sendo baixado");
			this.downloadObjectAsJson(valores, 'answer');	
			this.setState({anexo: true});
		}
		
		return ""

	}

	downloadObjectAsJson = (exportObj, exportName) => {
		    var dataStr = "data:text/json;charset=utf-8," + (JSON.stringify(exportObj));
		    var downloadAnchorNode = document.createElement('a');
		    downloadAnchorNode.setAttribute("href",     dataStr);
		    downloadAnchorNode.setAttribute("download", exportName + ".json");
		    document.body.appendChild(downloadAnchorNode); // required for firefox
		    downloadAnchorNode.click();
		    downloadAnchorNode.remove();

		}

	onSelectFile = e => {
		e.preventDefault();

		let arq = e.target.files[0];

		this.setState({file: arq});

    }

    enviar = e => {
		e.preventDefault();
		console.log(this.state.file);

		if (this.state.file) {
			 let aux = new FormData();
		                       
		     aux.append('answer', this.state.file);

              axios({
			        method: 'POST',
			        url: 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token='+this.state.token,
			        data: aux,
			        headers:{
			              "Content-type": 'multipart/form-data',			              
			        }

			      }).then(response=> 
			          alert("Enviada"),
			          console.log(response),
			      ).catch(err=>
			          alert("Erro."),
			          console.log(err)
			      )       
        }
    }
	render () {
		return (

			<>
				<div className="desafio"> 
					<h1>Criptografia de Júlio César</h1>
					<h1>Numero de casas: {this.state.numero_casas}</h1>
					<h1>Frase: {this.state.cifrado}</h1>
					<h1>Decifrado: {this.state.decifrado}</h1>

					{
							<form onSubmit={this.enviar}> 
								<input type="file" onChange={this.onSelectFile}/>  
								<button type="submit"> Enviar </button> 
							</form>
					}
					
				</div>
			</>




		);
	}
}

export default Desafio;